export function paintPixel(color, coords) {
  // get current canvas
  const canvas = document.querySelector(".panner-container canvas");
  const ctx = canvas.getContext("2d");

  // paint the pixel onto the canvas
  // will need to wait for the canvas to load
  ctx.fillStyle = color;
  ctx.fillRect(coords.x, coords.y, 1, 1);
}
