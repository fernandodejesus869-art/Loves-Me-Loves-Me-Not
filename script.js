(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = 180, H = 240, CX = 90, CY = 108, N = 12;
  const loves = "#ff8fc0", notLoves = "#a9bcff";
  let petals, removed, result, finished, startTime = performance.now();
  const stars = Array.from({length: 45}, () => ({
    x: 2 + Math.random() * (W - 4), y: 2 + Math.random() * 118,
    phase: Math.random() * Math.PI * 2
  }));
  const grass = Array.from({length: 65}, () => ({
    x: Math.random() * W, y: 194 + Math.random() * 38,
    h: 3 + Math.random() * 6,
    c: ["#3c963c", "#287832", "#5ab446"][Math.floor(Math.random() * 3)]
  }));

  function reset() {
    petals = Array(N).fill(true);
    removed = 0; result = ""; finished = false;
  }
  reset();

  function lerp(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
  function background(time) {
    const top = [8, 12, 58], bottom = [110, 70, 150];
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgb(8,12,58)");
    grad.addColorStop(.8, "rgb(110,70,150)");
    grad.addColorStop(1, "rgb(110,70,150)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    // Colinas e chão
    ctx.fillStyle = "#1c266e";
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x++) ctx.lineTo(x, 172 + 9*Math.sin(x*.035) + 5*Math.sin(x*.09+1));
    ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = "#144632";
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x++) ctx.lineTo(x, 190 + 4*Math.sin(x*.06+2));
    ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = "#1e5a28"; ctx.fillRect(0, 200, W, 40);

    stars.forEach(s => {
      if (Math.sin(time/450 + s.phase) > .1) {
        ctx.fillStyle = "#e3e2ff"; ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      }
    });
    grass.forEach(g => {
      ctx.strokeStyle = g.c; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x-2, g.y-g.h); ctx.stroke();
    });
  }

  function flower() {
    // Caule e folhas
    ctx.strokeStyle = "#23964b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(CX, CY+12); ctx.lineTo(90, 208); ctx.stroke();
    ctx.fillStyle = "#37b44d";
    ctx.beginPath(); ctx.ellipse(72, 160, 12, 5, -.25, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(105, 174, 12, 5, .25, 0, Math.PI*2); ctx.fill();

    // Pétalas em volta do centro
    for (let i = 0; i < N; i++) {
      if (!petals[i]) continue;
      const a = i * Math.PI * 2 / N - Math.PI/2;
      const x = CX + Math.cos(a)*17, y = CY + Math.sin(a)*17;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI/2);
      ctx.fillStyle = loves; ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 11, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#ffc2df"; ctx.beginPath(); ctx.ellipse(-1.5, -3, 2, 6, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#e6aa28"; ctx.beginPath(); ctx.arc(CX, CY, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffd34b"; ctx.beginPath(); ctx.arc(CX, CY, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#a66a24"; ctx.fillRect(CX-3, CY-3, 2, 2);
  }

  function centered(text, y, color, size=9) {
    ctx.font = `bold ${size}px monospace`; ctx.textAlign = "center";
    ctx.fillStyle = color; ctx.fillText(text, W/2, y);
  }

  function draw(time) {
    background(time); flower();
    ctx.textAlign = "left"; ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#ffe6f5"; ctx.fillText("LOVES ME, LOVES ME NOT", 12, 18);
    ctx.font = "bold 7px monospace"; ctx.fillStyle = "#e6dcff";
    ctx.fillText(`PETALS: ${N-removed}/${N}`, 8, 30);

    if (result) centered(result, 53, result === "LOVES ME!" ? loves : notLoves, 10);
    if (finished) centered("THE END", 224, "#ffe6f5", 9);
    else centered("CLICK OR SPACE", 225, "#dcdcff", 8);
  }

  function pluck() {
    if (finished) return;
    petals[removed] = false;
    result = removed % 2 === 0 ? "LOVES ME!" : "LOVES ME NOT!";
    removed++;
    if (removed >= N) finished = true;
  }

  canvas.addEventListener("click", pluck);
  document.getElementById("pluck").addEventListener("click", pluck);
  document.getElementById("reset").addEventListener("click", reset);
  window.addEventListener("keydown", e => {
    if (e.code === "Space") { e.preventDefault(); pluck(); }
    if (e.key.toLowerCase() === "r") reset();
  });

  function loop(time) { draw(time - startTime); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();
