import { pixelX, pixelY, target } from "./client.js";

let coordinates = document.querySelector(".canvas-coordinates");
coordinates.textContent = "0, 0";

target.addEventListener("click", (el) => {
  coordinates.textContent = `${pixelX}, ${pixelY}`
})
