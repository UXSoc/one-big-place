import { pannerInit } from "./panner.js";
import { loadCanvas } from "./canvas.js";
import { PixelSelector, getPixelId } from "./selector.js";
import { showPalette, hidePalette, loadPalette } from "./palette.js";
import { connectToServer } from "./socket.js";
import { closeTabs, setupTabs } from "./nav.js";
import { handleURLParams } from "./auth.js";
import { loadSfx, playSfx } from "./sounds.js";
import { startEndingCountdown } from "./ending.js";

const ZOOM_THRESHOLD = 15;

let pixelSelector = new PixelSelector();

var target = document.getElementById('canvas')
var pixelSelectorDisplay = document.querySelector(".pixel-selector");

pannerInit(target, {
    onInit: (pixelSize) => {
      target.style.boxShadow = `0px 0px ${pixelSize*3}px ${pixelSize}px rgba(0,0,0,0.4)`;
    },
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setPixelSelector(target, x, y);
      getPixelId(target, x, y)
      playSfx('select', 1);
      showPalette();
      closeTabs();
    },
    onDrag: () => {
        hidePalette();
        closeTabs();
    },
    onDragEnd: () => {
    },
    onZoom: (pixelSize, zoomValue) => {
      closeTabs();
      hidePalette();
      target.style.boxShadow = `0px 0px ${pixelSize*3}px ${pixelSize}px rgba(0,0,0,0.4)`;
      pixelSelectorDisplay.style.width = `${pixelSize}px`;
      if (zoomValue < ZOOM_THRESHOLD) {
        pixelSelectorDisplay.style.display = "none";
        pixelSelectorDisplay.isDisplayNone = true;
      } else {
        pixelSelectorDisplay.style.display = "block";
        pixelSelectorDisplay.isDisplayNone = false;
      }
      getPixelId(target, pixelSelector.coordinatesX, pixelSelector.coordinatesY)
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
getPixelId(0, 0)
connectToServer();
loadSfx();
setupTabs();
handleURLParams();
startEndingCountdown();