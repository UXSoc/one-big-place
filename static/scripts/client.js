import { pannerInit } from "./panner.js";
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { paintPixel } from "./paint.js";
import { showPalette, hidePalette } from "./palette.js";

const ZOOM_THRESHOLD = 5;

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
      showPalette();
    },
    onZoom: (pixelSize, zoomValue) => {
      hidePalette();
      clearTimeout(window.zoomTimeout); 
      window.zoomTimeout = setTimeout(() => {
        if (coords != null) {
          showPalette();
        }
      }, 300); 
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
  const selectedColor = e.detail.color;
  const [x, y] = coords;
  paintPixel(selectedColor, { x, y }); 
});

loadCanvas(target.querySelector('.image'))
