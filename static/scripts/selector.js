/*
  * TODO:
  * 1. Add getters and setters (position, palette, pixelPaint, etc.)
  * 2. Add pixel selector display
  */
class PixelSelector {
  constructor() {
    this.coordinates = document.querySelector(".canvas-coordinates")
    this.coordinatesX = 0
    this.coordinatesY = 0
    this.coordinates.textContent = `${this.coordinatesX}, ${this.coordinatesY}`
  }
  getCoordinates() {
    return [this.coordinatesX, this.coordinatesY]
  }
  setCoordinates(x, y) {
    this.coordinatesX = x
    this.coordinatesY = y
    this.coordinates.textContent = `${x}, ${y}`
  }
}

export {
  PixelSelector
}
