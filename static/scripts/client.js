import { pannerInit } from "./panner.js";
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { paintPixel } from "./paint.js";
import { showPalette, hidePalette, loadPalette } from "./palette.js";

const ZOOM_THRESHOLD = 5;
const colorsArray = [
  '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
  '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
  '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
  '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];

let pixelSelector = new PixelSelector();

var target = document.getElementById('canvas')
var body = document.querySelector("body");
var pixelSelectorDisplay = document.querySelector(".pixel-selector");

var coords = null;

pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setPixelSelector(target, x, y);
      coords = pixelSelector.getPixelSelector();
      showPalette();
    },
    onDrag: () => {
      hidePalette();
    },
    onDragEnd: () => {
    },
    onZoom: (pixelSize, zoomValue) => {
      hidePalette();
      pixelSelectorDisplay.style.width = `${pixelSize}px`;
      if (zoomValue < ZOOM_THRESHOLD) {
        pixelSelectorDisplay.style.display = "none";
      } else {
        pixelSelectorDisplay.style.display = "block";
      }
    },
    zoom: {
        value: 10,
        min: 1,
        max: 40,
        step: 0.1
    }
})

document.addEventListener("colorSelected", (e) => {
  const color_id = e.detail.color_id;
  const [x, y] = coords;
  paintPixel(colorsArray[color_id], { x, y }); 
  socket.emit("PaintPixel", {"x":x, "y":y, "id":color_id})
});

loadPalette(colorsArray)
loadCanvas(target.querySelector('.image'))
var socket = io.connect("localhost:2345");
socket.on("PaintPixel", (data) => {
  paintPixel(colorsArray[data.id], {"x":data.x, "y":data.y}); 
})