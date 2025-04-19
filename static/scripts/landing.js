const canvas = document.querySelector("#js-landing-bg");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;

const pixelSize = 30;
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

const activePixels = new Map();

const trailColors = ["#1b1b66", "#1a1a40", "#26264a"];
const fadeSpeed = 1;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, pixelSize, pixelSize);

  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
  activePixels.set(`${x},${y}`, { x, y, r, g, b });
}

function fadeAllPixels() {
  activePixels.forEach((pixel, key) => {
    pixel.r = Math.max(0, pixel.r - fadeSpeed);
    pixel.g = Math.max(0, pixel.g - fadeSpeed);
    pixel.b = Math.max(0, pixel.b - fadeSpeed);

    ctx.fillStyle = `rgb(${pixel.r},${pixel.g},${pixel.b})`;
    ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);

    if (pixel.r === 0 && pixel.g === 0 && pixel.b === 0) {
      activePixels.delete(key);
    }
  });

  requestAnimationFrame(fadeAllPixels);
}
requestAnimationFrame(fadeAllPixels);

window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const pixelX = Math.floor(mouseX / pixelSize) * pixelSize;
  const pixelY = Math.floor(mouseY / pixelSize) * pixelSize;

  const key = `${pixelX},${pixelY}`;
  if (!activePixels.has(key)) {
    const color = trailColors[Math.floor(Math.random() * trailColors.length)];
    drawPixel(pixelX, pixelY, color);
  }
});
