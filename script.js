const navLinks = document.querySelectorAll(".top-nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("is-active"));
    link.classList.add("is-active");
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const petalCanvas = document.getElementById("petal-canvas");

if (petalCanvas && !prefersReducedMotion.matches) {
  const ctx = petalCanvas.getContext("2d");

  if (ctx) {
    const petals = [];
    const maxPetals = Math.min(56, Math.max(26, Math.floor(window.innerWidth / 24)));
    let width = 0;
    let height = 0;
    let rafId = 0;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      petalCanvas.width = Math.floor(width * dpr);
      petalCanvas.height = Math.floor(height * dpr);
      petalCanvas.style.width = `${width}px`;
      petalCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createPetal(startAboveViewport = true) {
      const scale = Math.random() * 0.9 + 0.6;
      return {
        x: Math.random() * width,
        y: startAboveViewport
          ? -Math.random() * height * 0.8 - 20
          : Math.random() * height,
        speedY: 0.45 + Math.random() * 0.95,
        driftX: (Math.random() - 0.5) * 0.65,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.011 + Math.random() * 0.022,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        scale,
        opacity: 0.35 + Math.random() * 0.45,
        shapeStretch: 0.6 + Math.random() * 0.35,
      };
    }

    function drawPetal(petal) {
      const baseW = 13 * petal.scale;
      const baseH = 18 * petal.scale * petal.shapeStretch;

      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;

      ctx.beginPath();
      ctx.moveTo(0, -baseH * 0.56);
      ctx.bezierCurveTo(baseW * 0.56, -baseH * 0.34, baseW * 0.55, baseH * 0.28, 0, baseH * 0.56);
      ctx.bezierCurveTo(-baseW * 0.55, baseH * 0.28, -baseW * 0.56, -baseH * 0.34, 0, -baseH * 0.56);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -baseH * 0.5);
      ctx.lineTo(0, baseH * 0.48);
      ctx.strokeStyle = "rgba(216, 216, 216, 0.5)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i += 1) {
        const petal = petals[i];
        petal.sway += petal.swaySpeed;
        petal.x += petal.driftX + Math.sin(petal.sway) * 0.36;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > height + 26 || petal.x < -40 || petal.x > width + 40) {
          petals[i] = createPetal(true);
          continue;
        }

        drawPetal(petal);
      }

      rafId = window.requestAnimationFrame(animate);
    }

    resizeCanvas();
    for (let i = 0; i < maxPetals; i += 1) {
      petals.push(createPetal(false));
    }
    animate();

    window.addEventListener("resize", resizeCanvas, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        animate();
      }
    });
  }
}
