import { pannerInit } from "./panner.js"
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { paintPixel } from "./paint.js";

let pixelSelector = new PixelSelector()

var target = document.getElementById('canvas')
var colorButton = document.getElementById("color-button"); // placeholder

var coords = null;

pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setPixelSelector(target, x, y)
      coords = pixelSelector.getPixelSelector();
    },
    zoom: {
        value: 10,
        min: 1,
        max: 40,
        step: 0.1
    }
})

colorButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (coords != null) {
    paintPixel("#123456", {"x": coords[0], "y": coords[1]});
  }
})


// pixelsize and coords should be passed to palette here ?
// nvm let it be called t

loadCanvas(target.querySelector('.image'))
