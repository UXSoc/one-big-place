import { playSfx } from "./sounds.js";
import { setUserGrid } from "./canvas.js";

let generationTimer = undefined;
let maxBits = 5;
let bitCount = 5;
let bitGenerationInterval = 15*1000; // in ms
export const colorsArray = [
    '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
    '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
    '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
    '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];

function generatePixl(timeout=bitGenerationInterval) {
  console.log(`setting timeout of ${timeout/1000}`)
  clearTimeout(generationTimer)
  generationTimer = setTimeout(() => {
    bitCount++;
    console.log(`Generated Pixel ${bitCount}/${maxBits}`)
    if (bitCount<maxBits) {
      generatePixl();
    } else {
      generationTimer = undefined
    }
    updateBits()
  }, timeout)
}

// get current canvas
const canvas = document.querySelector(".panner-container canvas");
const ctx = canvas.getContext("2d");

export function paintPixel(color_id, x, y, socket) {
  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  if (bitCount>0) {
    paintPixelOnCanvas(color_id, x, y)
    bitCount--;
    playSfx('place', 1);
    updateBits()
    socket.emit("PaintPixel", {"x":x, "y":y, "id":color_id})
  }
}

export function paintPixelOnCanvas(color_id, x, y, userId) {
  setUserGrid(userId, x, y)
  ctx.fillStyle = colorsArray[color_id];
  ctx.fillRect(x, y, 1, 1);
}

const bits_container = document.querySelector("#bits-counter");
const bits_p = document.querySelector("#bits-display > div > p")
function loadBits() {
  for (let i = 0; i < bitCount; i++) {
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
    if (i > bitCount-1) {
      bits[i].classList.remove("filled");
    } else {
      bits[i].classList.add("filled");
    }
  }
  bits_p.innerHTML = `<span>${bitCount}</span> Bits Left`
}
updateBits()

export function syncCooldown(data) {
  bitCount = data.current_bits;
  updateBits();
  if (bitCount < data.maxBits) {
    generatePixl(bitGenerationInterval-(data.extra_time*1000));
  }
}