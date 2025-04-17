const canvas = document.querySelector("#js-landing-bg");
const ctx = canvas.getContext("2d");

let { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;

const pixelSize = 30;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, width, height);

const pixelArray = [];

let trailLength = 10;
let trailColors = ["#13132b"];

window.addEventListener("mousemove", (e) => {
  const mouseX = e.x;
  const mouseY = e.y;
  const pixelX = (mouseX == pixelSize) ? (0) : (Math.floor(mouseX / pixelSize) * pixelSize);
  const pixelY = (mouseY == pixelSize) ? (0) : (Math.floor(mouseY / pixelSize) * pixelSize);
  drawPixel(pixelX, pixelY, trailColors[Math.floor(Math.random()*trailColors.length)]);
  if (pixelArray.find((a) => {return (JSON.stringify(a) === JSON.stringify([pixelX, pixelY]));}) === undefined) {
    pixelArray.unshift([pixelX, pixelY]);
    if (pixelArray.length > trailLength) {
      let [prevPixelX, prevPixelY] = pixelArray.pop();
      drawPixel(prevPixelX, prevPixelY, "#000000");
    }
  }
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x,
    y,
    pixelSize,
    pixelSize
  );
}