class PixelSelector {
  constructor() {
    this.coordinates = document.querySelector(".canvas-coordinates");
    this.initCoordinatesX = 0;
    this.initCoordinatesY = 0;
    this.coordinatesX = 0;
    this.coordinatesY = 0;
    this.coordinates.textContent = `0, 0`;

    this.selector = document.querySelector(".pixel-selector");
    this.selector.interfacePos = [0, 0];
  }
  getPixelSelector() {
    return [this.coordinatesX, this.coordinatesY];
  }
  setPixelSelector(target, x, y) {
    this.initCoordinatesX = this.getPixelSelector()[0];
    this.initCoordinatesY = this.getPixelSelector()[1];
    this.changeCoordinates(x, y);
    this.changeSelector(target, x, y);
  }
  changeCoordinates(x, y) {
    this.coordinatesX = x;
    this.coordinatesY = y;
    this.coordinates.textContent = `${x}, ${y}`;
  }
  changeSelector(target, x, y) {
    this.selector.interfacePos = [x, y];

    if (target.zoom < 2) {
      this.selector.style.display = "none";
    } else {
      this.selector.animate(
        [
          {
            translate: `${this.initCoordinatesX * target.pixelSize}px ${
              this.initCoordinatesY * target.pixelSize
            }px`,
          },
          { translate: `${x * target.pixelSize}px ${y * target.pixelSize}px` },
        ],
        {
          duration: 150,
          iterations: 1,
        }
      );
      this.selector.src = "images/Selector.svg";
      this.selector.style = `
      display: block;
      position: absolute;
      translate: ${x * target.pixelSize}px ${y * target.pixelSize}px;
      width: ${target.pixelSize}px;
      aspect-ratio: 1 / 1;
      `;
    }
  }
}

export { PixelSelector };
