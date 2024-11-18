/*
  * TODO:
  * 1. Add getters and setters (position, palette, pixelPaint, etc.)
  * 2. Add pixel selector functionality
  */
class PixelSelector {
  constructor() {
    this.coordinates = document.querySelector(".canvas-coordinates")
    this.coordinates.textContent = "0, 0"
  }
  displayCoordinates(x, y) {
    this.coordinates.textContent = `${x}, ${y}`
  }
}

export {
  PixelSelector
}
