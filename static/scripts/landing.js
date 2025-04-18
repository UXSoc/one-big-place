const canvas = document.querySelector("#js-landing-bg");
const ctx = canvas.getContext("2d");

const { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;

const pixelSize = 30;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

const pixelArray = [];

const trailLength = 10;
const trailColors = ["#13132b"];
const trailFadeDelay = 1;

window.addEventListener("load", () => {
  setInterval(() => {
    if (pixelArray.length > trailLength) {
      const [prevPixelX, prevPixelY] = pixelArray.pop();
      const prevPixel = ctx.getImageData(prevPixelX, prevPixelY, pixelSize, pixelSize);
      window.requestAnimationFrame(() => { fadePixel(prevPixelX, prevPixelY, prevPixel) });
    }
  }, trailFadeDelay);
});

window.addEventListener("mousemove", (e) => {
  const mouseX = e.x;
  const mouseY = e.y;
  const pixelX = (mouseX == pixelSize) ? (0) : (Math.floor(mouseX / pixelSize) * pixelSize);
  const pixelY = (mouseY == pixelSize) ? (0) : (Math.floor(mouseY / pixelSize) * pixelSize);
  drawPixel(pixelX, pixelY, trailColors[Math.floor(Math.random()*trailColors.length)]);
  if (pixelArray.find((a) => {return (JSON.stringify(a) === JSON.stringify([pixelX, pixelY]));}) === undefined) {
    pixelArray.unshift([pixelX, pixelY]);
  }
});

function fadePixel(x, y, pixel) {
  for (let i = 0; i < pixel.data.length; i += 4) {
    let r = pixel.data[i];
    let g = pixel.data[i+1];
    let b = pixel.data[i+2];
    
    if (r > 0) { r--; }
    pixel.data[i] = r;

    if (g > 0) { g--; }
    pixel.data[i+1] = g;

    if (b > 0) { b--; }
    pixel.data[i+2] = b;
  }
  ctx.putImageData(pixel, x, y);
  window.requestAnimationFrame(() => { fadePixel(x, y, pixel); });
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x,
    y,
    pixelSize,
    pixelSize
  );
}