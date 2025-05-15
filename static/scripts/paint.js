import { disablePalette, enablePalette } from "./palette.js";
import { getUserData } from "./user.js";
import { playSfx } from "./sounds.js";
export const paintEventTarget = new EventTarget();

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
  clearTimeout(generationTimer)
  document.querySelectorAll('#bits-counter > div > div').forEach((item) => { item.remove(); })
  const fillingBit = document.querySelector('#bits-counter > div:not(.filled)')
  if (fillingBit) {
    const bitFiller = document.createElement('div');
    bitFiller.className = "bit-filler";
    bitFiller.style.animationDuration = `${bitGenerationInterval/1000}s`;
    bitFiller.style.animationDelay = `-${(bitGenerationInterval/1000)-(timeout/1000)}s`;
    fillingBit.append(bitFiller);
  }
  generationTimer = setTimeout(() => {
    bitCount++;
    updateBits()
    if (bitCount<maxBits) {
      generatePixl();
    } else {
      generationTimer = undefined
      document.querySelectorAll('#bits-counter > div > div').forEach((item) => { item.remove(); })
    }
  }, timeout)
}

// get current canvas
const canvas = document.querySelector(".panner-container canvas");
const ctx = canvas.getContext("2d");

export async function paintPixel(color_id, x, y, socket) {
  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  if (bitCount>0) {
    paintPixelOnCanvas(color_id, x, y)
    const userData = await getUserData();
    if (userData) bitCount--;
    playSfx('place', 1);
    updateBits()
    socket.emit("PaintPixel", {"x":x, "y":y, "id":color_id})
  }
}

export function paintPixelOnCanvas(color_id, x, y, userId) {
  ctx.fillStyle = colorsArray[color_id];
  ctx.fillRect(x, y, 1, 1);
  paintEventTarget.dispatchEvent(new CustomEvent('pixelPainted', {
      detail: { color_id, x, y, userId  }
  }));  
}

const bits_container = document.querySelector("#bits-counter");
const bits_p = document.querySelector("#bits-display > div > p")
export function loadBits() {
  bits_container.innerHTML = '';
  for (let i = 0; i < Math.min(maxBits, 8); i++) {
    var bit = document.createElement('div')
    if (i<bitCount) bit.classList.add("filled");
    bits_container.append(bit)
  }
  bits_p.innerHTML = "<span>0</span>Bits Left"
}
loadBits()

function updateBits() {
  var bits = bits_container.querySelectorAll("div:not(.bit-filler)");
  if (bits.length<maxBits) {
    const label_p = document.createElement('p');
    label_p.innerText = (Math.max(0,bitCount-8)==0)?"":`+${Math.max(0,bitCount-8)+1}`
    bits[bits.length-1].querySelectorAll('p').forEach((item) => {
      item.remove();
    })
    bits[bits.length-1].append(label_p) 
  };
  for (let i = 0; i < bits.length; i++) {
    if (i > bitCount-1) {
      bits[i].classList.remove("filled");
    } else {
      bits[i].classList.add("filled");
    }
  }
  const bitFiller = bits_container.querySelector('.bit-filler');
  if (bitFiller) {
    const fillingBit = document.querySelector('#bits-counter > div:not(.filled)')
    fillingBit.append(bitFiller);
  }
  bits_p.innerHTML = `<span>${bitCount}</span> Bits Left`
  if (bitCount<=0) {
    disablePalette();
    return;
  }
  enablePalette();
}
updateBits()

export function syncCooldown(data) {
  bitCount = data.current_bits;
  if (maxBits !== data.maxBits) {
    maxBits = data.maxBits;
    loadBits()
  };
  bitGenerationInterval = data.bitGenerationInterval;
  updateBits();
  if (bitCount < data.maxBits) {
    generatePixl(bitGenerationInterval-data.extra_time);
  }
}