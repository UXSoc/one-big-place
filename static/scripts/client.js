import { pannerInit } from "./panner.js"
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";
import { paintPixel } from "./paint.js";

let pixelSelector = new PixelSelector()

var target = document.getElementById('canvas')
var colorButton = document.getElementById("color-button"); // placeholder

pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setPixelSelector(target, x, y)
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
  paintPixel("#123456", {"x": 0, "y": 0});
})

// pixelsize and coords should be passed to palette here ?
// nvm let it be called t

loadCanvas(target.querySelector('.image'))
