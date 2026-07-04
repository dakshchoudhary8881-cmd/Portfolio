window.addEventListener("DOMContentLoaded", () => {
  const bootLines = [
    "BIOS INITIALIZED: MEMORY OK (64840 KB)",
    "LOADING KERNEL MODULES... [TASKFLOW, COVERCRAFT, KAVA]",
    "MOUNTING HARDWARE TELEMETRY... [SENTINEL, GLIDECART]",
    "CONNECTING AI ENGINE... [GEMINI 2.0 FLASH READY]",
    "SYSTEM ONLINE. LAUNCHING CONSOLE UI...",
  ];
  const logEl = document.getElementById("boot-log");
  const progressEl = document.getElementById("boot-progress");
  const statusEl = document.getElementById("boot-status-text");
  const overlayEl = document.getElementById("boot-overlay");
  let currentLine = 0;
  const interval = setInterval(() => {
    if (currentLine < bootLines.length) {
      const lineDiv = document.createElement("div");
      lineDiv.className = "boot-line";
      lineDiv.textContent = `> ${bootLines[currentLine]}`;
      logEl.appendChild(lineDiv);
      const percent = ((currentLine + 1) / bootLines.length) * 100;
      progressEl.style.width = `${percent}%`;
      currentLine++;
    } else {
      clearInterval(interval);
      statusEl.textContent = "EXECUTION COMPLETE";
      statusEl.style.color = "var(--circuit)";
      setTimeout(() => {
        overlayEl.style.opacity = "0";
        overlayEl.style.visibility = "hidden";
      }, 400);
    }
  }, 240);
});

let seconds = 0;
const uptimeEl = document.getElementById("uptime-clock");
setInterval(() => {
  seconds++;
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  if (uptimeEl) uptimeEl.textContent = `${h}:${m}:${s}`;
}, 1000);
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});
function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();
document
  .querySelectorAll("a, button, .module-card, .port-panel")
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileDrawer = document.getElementById("mobile-nav-drawer");
if (mobileBtn && mobileDrawer) {
  mobileBtn.addEventListener("click", () => {
    mobileBtn.classList.toggle("active");
    mobileDrawer.classList.toggle("active");
  });
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileBtn.classList.remove("active");
      mobileDrawer.classList.remove("active");
    });
  });
}
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        if (entry.target.id === "signal") {
          document.querySelectorAll(".signal-bar-fill").forEach((bar) => {
            const w = bar.getAttribute("data-width");
            setTimeout(() => {
              bar.style.width = w;
            }, 200);
          });
        }
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

function initWebGL() {
  const container = document.getElementById("webgl-canvas");
  if (!container || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xff4500,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  coreGroup.add(icoMesh);

  const sphereGeo = new THREE.SphereGeometry(0.95, 12, 12);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x39ff88,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(sphereMesh);

  const particleCount = 200;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 8;
    particlePositions[i + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 8;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMat = new THREE.PointsMaterial({
    color: 0xffa542,
    size: 0.04,
    transparent: true,
    opacity: 0.65,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  coreGroup.add(particleSystem);

  let targetX = 0;
  let targetY = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.2;
  });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0) {
      targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 1.2;
      targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 1.2;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  let clock = new THREE.Clock();
  function renderScene() {
    requestAnimationFrame(renderScene);

    const elapsed = clock.getElapsedTime();

    icoMesh.rotation.x += 0.003;
    icoMesh.rotation.y += 0.005;

    const pulse = 1 + Math.sin(elapsed * 2.2) * 0.04;
    icoMesh.scale.set(pulse, pulse, pulse);

    sphereMesh.rotation.x -= 0.006;
    sphereMesh.rotation.y -= 0.004;

    particleSystem.rotation.y += 0.0015;

    coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05;
    coreGroup.rotation.x += (-targetY - coreGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  renderScene();
}

initWebGL();
