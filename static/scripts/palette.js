import { socket } from "./socket.js";
import { paintPixel, colorsArray } from "./paint.js";

const colorPalette = document.getElementById('color-palette');
const colorContainer = document.getElementById('color-container');

export function showPalette() {
    colorPalette.classList.add("active");
}

export function hidePalette() {
    colorPalette.classList.remove("active");
}

export function loadPalette(pixelSelector) {
    for (let i = 0; i < colorsArray.length; i++) {
        const colorElement = document.createElement("div");
        colorElement.className = "colors";
        colorElement.style.backgroundColor = colorsArray[i];
        colorElement.id = i;
    
        colorElement.onclick = function () {
            const color_id = this.id;
            const [x, y] = pixelSelector.getPixelSelector()
            paintPixel(color_id, { x, y }, socket);
        };
    
        colorContainer.appendChild(colorElement);
    }
    
    document.querySelector("#color-tab").addEventListener("click", function() {
        if (colorPalette.classList.contains("active")) {
            hidePalette();
        } else {
            showPalette();
        }
    })
}