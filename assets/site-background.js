(() => {
  const canvas = document.querySelector("[data-site-background]");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let frame = 0;
  let animationId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGrid(time) {
    const spacing = width < 700 ? 24 : 30;
    context.fillStyle = "rgba(255, 255, 255, 0.12)";

    for (let y = -spacing; y < height + spacing; y += spacing) {
      for (let x = -spacing; x < width + spacing; x += spacing) {
        const wave = Math.sin((x * 0.018) + (y * 0.012) + time * 0.0016);
        const drift = Math.cos((x - y) * 0.009 + time * 0.0012);
        const alpha = 0.035 + Math.max(0, wave * drift) * 0.09;
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(x + wave * 4, y + drift * 4, 1.1, 0, Math.PI * 2);
        context.fill();
      }
    }

    context.globalAlpha = 1;
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);

    const base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#060806");
    base.addColorStop(0.48, "#10120f");
    base.addColorStop(1, "#050608");
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);

    const glowA = context.createRadialGradient(width * 0.2, height * 0.12, 0, width * 0.2, height * 0.12, width * 0.65);
    glowA.addColorStop(0, "rgba(61, 128, 96, 0.28)");
    glowA.addColorStop(1, "rgba(61, 128, 96, 0)");
    context.fillStyle = glowA;
    context.fillRect(0, 0, width, height);

    const glowB = context.createRadialGradient(width * 0.86, height * 0.78, 0, width * 0.86, height * 0.78, width * 0.7);
    glowB.addColorStop(0, "rgba(47, 86, 124, 0.24)");
    glowB.addColorStop(1, "rgba(47, 86, 124, 0)");
    context.fillStyle = glowB;
    context.fillRect(0, 0, width, height);

    drawGrid(time);
  }

  function animate(time) {
    draw(time);
    animationId = window.requestAnimationFrame(animate);
  }

  function start() {
    window.cancelAnimationFrame(animationId);
    if (prefersReducedMotion.matches) {
      draw(frame);
      return;
    }
    animationId = window.requestAnimationFrame(animate);
  }

  resize();
  start();

  window.addEventListener("resize", () => {
    resize();
    draw(frame);
  });

  prefersReducedMotion.addEventListener("change", start);
})();
