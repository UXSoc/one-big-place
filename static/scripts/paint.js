let generationTimer = undefined;
let slotCapacity = 6;
let slotCount = 6;
let slotGenerationCooldown = 15*1000; // in ms
export const colorsArray = [
    '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
    '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
    '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
    '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];

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

export function paintPixel(color_id, coords, socket) {
  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  var color = colorsArray[color_id]
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

export function paintPixelOnCanvas(color_id, x, y) {
  ctx.fillStyle = colorsArray[color_id];
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
