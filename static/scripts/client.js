import { pannerInit } from "./panner.js"
import { loadCanvas } from "./canvas.js";

var target = document.getElementById('canvas')
pannerInit(target, {
    onDrag: function() {},
    onDragStart: function() {},
    onDragEnd: function() {},
    onClick: (x, y, clientX, clientY) => {console.log(x,y,clientX,clientY)},
    zoom: {
        value: 10,
        allow: true,
        min: 1,
        max: 40,
        step: 0.4,
        center: null
    },
    pos: "center"
})
loadCanvas(target.querySelector('.image'))