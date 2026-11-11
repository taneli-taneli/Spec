const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');
const wordLabel = document.querySelector('.spec-label');

let dots = [];
const spacing = 12;
const wordSequence = ['FORM', 'TIDE', 'LIFE', 'SPEC'];
let wordIndex = 0;

function animateWordSequence() {
  wordLabel.textContent = wordSequence[wordIndex];
  wordLabel.classList.remove('animating');
  void wordLabel.offsetWidth;
  wordLabel.classList.add('animating');

  wordIndex = (wordIndex + 1) % wordSequence.length;

  const delay = wordIndex === 0 ? 1800 : 900;
  setTimeout(animateWordSequence, delay);
}

animateWordSequence();

function resizeCanvas() {
  const sheet = document.querySelector('.sheet');
  const rect = sheet.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  buildDotField();
}

function buildDotField() {
  const w = canvas.width;
  const h = canvas.height;

  const mask = document.createElement('canvas');
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext('2d');

  mctx.clearRect(0, 0, w, h);
  mctx.fillStyle = '#fff';
  mctx.fillRect(0, 0, w, h);
  mctx.textAlign = 'center';
  mctx.textBaseline = 'middle';
  mctx.fillStyle = '#000';
  mctx.font = '900 ' + Math.min(w * 0.52, h * 0.36) + 'px "gunter", serif';
  mctx.fillText('SPEC', w * 0.5, h * 0.5);

  const maskData = mctx.getImageData(0, 0, w, h).data;
  dots = [];

  for (let y = 0; y < h; y += spacing) {
    for (let x = 0; x < w; x += spacing) {
      const idx = (y * w + x) * 4;
      const alpha = maskData[idx + 3];

      if (alpha > 20) {
        dots.push({
          x: x + Math.random() * 3 - 1.5,
          y: y + Math.random() * 3 - 1.5,
          r: 2 + Math.random() * 3,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  drawPoster();
}

function drawPoster() {
  const w = canvas.width;
  const h = canvas.height;
  const time = performance.now() * 0.001;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  for (const dot of dots) {
    const driftX = Math.sin(time * 1.4 + dot.phase) * 2.6;
    const driftY = Math.cos(time * 1.1 + dot.phase) * 2.4;
    const radius = dot.r + Math.sin(time * 2 + dot.phase) * 0.8;

    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(dot.x + driftX, dot.y + driftY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(resizeCanvas);
} else {
  resizeCanvas();
}

window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(function animate() {
  drawPoster();
  requestAnimationFrame(animate);
});

