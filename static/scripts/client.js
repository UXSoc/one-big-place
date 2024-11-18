import { pannerInit } from "./panner.js"
import { loadCanvas } from "./canvas.js";

export let pixelX = 0
export let pixelY = 0

export var target = document.getElementById('canvas')
pannerInit(target, {
    onClick: (x, y, clientX, clientY) => {
      pixelX = x
      pixelY = y
      console.log(x,y,clientX,clientY)
    },
    zoom: {
        value: 10,
        min: 1,
        max: 40,
        step: 0.1
    }
})
loadCanvas(target.querySelector('.image'))
