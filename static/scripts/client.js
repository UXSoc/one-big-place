import { pannerInit } from "./panner.js";
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { showPalette, hidePalette, loadPalette } from "./palette.js";
import { connectToServer } from "./socket.js";
import { openModal, closeModal } from "./modals.js";
import { setupTabs } from "./nav.js";
import { handleURLParams } from "./auth.js";

const ZOOM_THRESHOLD = 5;

let pixelSelector = new PixelSelector();

var target = document.getElementById('canvas')
var body = document.querySelector("body");
var pixelSelectorDisplay = document.querySelector(".pixel-selector");

pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setPixelSelector(target, x, y);
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

loadPalette(pixelSelector);
loadCanvas(target.querySelector('.image'));
connectToServer("localhost:3000");
setupTabs();
handleURLParams();