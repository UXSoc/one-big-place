import { pannerInit } from "./panner.js"
import { loadCanvas } from "./canvas.js";
import { PixelSelector } from "./selector.js";

let pixelSelector = new PixelSelector()

var target = document.getElementById('canvas')
pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelSelector.setCoordinates(target, x, y)
    },
    zoom: {
        value: 10,
        min: 1,
        max: 40,
        step: 0.1
    }
})
loadCanvas(target.querySelector('.image'))
