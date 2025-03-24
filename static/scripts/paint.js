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
    updateBits()
  }, slotGenerationCooldown)
}

// get current canvas
const canvas = document.querySelector(".panner-container canvas");
const ctx = canvas.getContext("2d");

export function paintPixel(color, color_id, coords, socket) {
  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  if (slotCount>0) {
    paintPixelOnCanvas(color, coords.x, coords.y)
    socket.emit("PaintPixel", {"x":coords.x, "y":coords.y, "id":color_id})
    slotCount--;
    updateBits()
    if (!generationTimer) {
      generationTimer = generatePixl();
    }
  }
}

export function paintPixelOnCanvas(color, x, y) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

const bits_container = document.querySelector("#bits-counter");
const bits_p = document.querySelector("#bits-display > div > p")
function loadBits() {
  for (let i = 0; i < slotCount; i++) {
    var bit = document.createElement('div')
    bit.classList.add("filled")
    bits_container.append(bit)
  }
  bits_p.innerHTML = "<span>0</span>Bits Left"
}
loadBits()

function updateBits() {
  var bits = bits_container.querySelectorAll("div");
  for (let i = 0; i < bits.length; i++) {
    if (i > slotCount-1) {
      bits[i].classList.remove("filled");
    } else {
      bits[i].classList.add("filled");
    }
  }
  bits_p.innerHTML = `<span>${slotCount}</span> Bits Left`
}
updateBits()
