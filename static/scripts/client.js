import { pannerInit } from "./panner.js";
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { paintPixel } from "./paint.js";
import { showPalette, hidePalette } from "./palette.js";

const ZOOM_THRESHOLD = 2;

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
    onZoom: () => {
      hidePalette();
      clearTimeout(window.zoomTimeout); 
      window.zoomTimeout = setTimeout(() => {
        if (coords != null) {
          showPalette();
        }
      }, 300); 
    },
    zoom: {
        value: 10,
        min: 1,
        max: 40,
        step: 0.1
    }
})

body.addEventListener("wheel", (e) => {
  if (target.zoom < ZOOM_THRESHOLD) {
    pixelSelectorDisplay.style.display = "none";
  } else {
    pixelSelectorDisplay.style.display = "block";
  }
})

document.addEventListener("colorSelected", (e) => {
  const selectedColor = e.detail.color;
  const [x, y] = coords;
  paintPixel(selectedColor, { x, y }); 
});

// pixelsize and coords should be passed to palette here ?
// nvm let it be called t

loadCanvas(target.querySelector('.image'))
