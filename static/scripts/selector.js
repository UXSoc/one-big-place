/*
  * TODO:
  * 1. Make pixel selector prettier
  */
class PixelSelector {
  constructor() {
    this.coordinates = document.querySelector(".canvas-coordinates")
    this.coordinatesX = 0
    this.coordinatesY = 0
    this.coordinates.textContent = `${this.coordinatesX}, ${this.coordinatesY}`

    this.selector = document.querySelector(".pixel-selector")
    this.selector.naturalWidth = 1
    this.selector.scaleWithZoom = true
  }
  getCoordinates() {
    return [this.coordinatesX, this.coordinatesY]
  }
  setCoordinates(target, x, y) {
    this.coordinatesX = x
    this.coordinatesY = y
    this.coordinates.textContent = `${x}, ${y}`

    this.selector.interfacePos = [x, y]
    this.selector.style = `
    position: absolute;
    translate: ${x*target.pixelSize}px ${y*target.pixelSize}px;
    outline: solid black;
    width: ${this.selector.naturalWidth*target.pixelSize}px;
    aspect-ratio: 1;
    `
  }
}

export {
  PixelSelector
}
