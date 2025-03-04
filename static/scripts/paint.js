let generationTimer = undefined;
let slotCapacity = 6;
let slotCount = 6;
let slotGenerationCooldown = 15*1000; // in ms

function generatePixl() {
  return setTimeout(() => {
    slotCount++;
    console.log(`Generated Pixel ${slotCount}/${slotCapacity}`)
    if (slotCount<slotCapacity) {
      generatePixl();
    } else {
      generationTimer = undefined
    }
  }, slotGenerationCooldown)
}

export function paintPixel(color, coords) {
  // get current canvas
  const canvas = document.querySelector(".panner-container canvas");
  const ctx = canvas.getContext("2d");

  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  if (slotCount>0) {
    ctx.fillStyle = color;
    ctx.fillRect(coords.x, coords.y, 1, 1);
    slotCount--;
    if (!generationTimer) {
      generationTimer = generatePixl();
    }
  }
}
