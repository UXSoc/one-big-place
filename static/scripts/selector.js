import { loadUserGrid, getUserGrid } from "./canvas.js";
import { getUserData } from "./user.js";

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

export class PixelSelector {
  constructor() {
    this.coordinates = document.querySelector(".canvas-coordinates > p");
    this.initCoordinatesX = 0;
    this.initCoordinatesY = 0;
    this.coordinatesX = 0;
    this.coordinatesY = 0;
    this.coordinates.textContent = `0, 0`;

    this.zoomThreshold = 15;
    this.selector = document.querySelector(".pixel-selector");
    this.selector.interfacePos = [0, 0];
    this.selector.isDisplayNone = true;
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
    if (selectingArea) {
      selectAreaClick(target, x, y);
    }
    if (!this.selector.isDisplayNone && isInViewport(this.selector)) {
      this.selector.animate(
        [
          {
            translate: `${this.initCoordinatesX * target.pixelSize}px ${
              this.initCoordinatesY * target.pixelSize
            }px`,
          },
          {
            translate: `${x * target.pixelSize}px ${y * target.pixelSize}px`,
          },
        ],
        {
          duration: 150,
          iterations: 1,
        }
      );
    } else {
      this.selector.style.animation = 'none';
      this.selector.offsetHeight;
      this.selector.style.animation = '';
    }
    this.selector.style = `
        display: block;
        position: absolute;
        translate: ${x * target.pixelSize}px ${y * target.pixelSize}px;
        width: ${target.pixelSize}px;
        aspect-ratio: 1 / 1;
    `;
    this.selector.isDisplayNone = false;
  }
}
const pin = document.querySelector(".panner_interface > .pixel-id");
export async function getPixelId(target, x, y) {
  pin.interfacePos = [x, y];
  pin.style.transform = `translate(${target.pixelSize}px, -110%)`;
  pin.updatePos();
  let user_grid = getUserGrid();
  if (!user_grid) {
    user_grid = await loadUserGrid();
    return;
  }
  const pixelId = user_grid[y][x];
  if (!pixelId) {
    pin.innerText = "";
    hidePixelId();
    return;
  }
  const userData = await getUserData(pixelId);
  if (userData?.id) {
    pin.innerText = `${userData.username} | ${getYearId(userData.idNumber)}'` || "";
    showPixelId();
  }
}
function getYearId(id) {
  const str = id.toString();
  return parseInt((str.length===6)?str.slice(0,2):((str.length===9)?str.slice(2, 4):null));
};
export function hidePixelId() {
  pin.style.backgroundColor = "transparent";
}
export function showPixelId() {
  pin.style.backgroundColor = "white";
}
let selectingArea = false;
let pos1, pos2;
let selectAreaCallback;
const highlighter = document.querySelector('.panner_interface > .selection-highlight');
export function selectArea(callback) {
  selectingArea = true;
  pos1 = null;
  pos2 = null;
  selectAreaCallback = callback;
  highlighter.style.display = 'none';
}
function selectAreaClick(target, x, y) {
  const pixelSize = target.pixelSize;
  highlighter.style.display = 'block';
  if (!pos1) {
    pos1 = [x,y];
    highlighter.interfacePos = [x,y];
    highlighter.style.width = `${pixelSize}px`
    highlighter.style.height = `${pixelSize}px`
    highlighter.naturalWidth = 1;
    highlighter.naturalHeight = 1
    highlighter.scaleWithZoom = true;
    highlighter.style.translate = `${x*pixelSize}px ${y*pixelSize}px`;
  } else if (!pos2) {
    pos2 = [x,y]
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;
    const startX = Math.min(x1, x2);
    const startY = Math.min(y1, y2);
    highlighter.interfacePos = [startX,startY];
    highlighter.style.translate = `${startX*pixelSize}px ${startY*pixelSize}px`;
    highlighter.style.width = `${(Math.abs(x1-x2)+1)*pixelSize}px`
    highlighter.style.height = `${(Math.abs(y1-y2)+1)*pixelSize}px`
    highlighter.naturalWidth = Math.abs(x1-x2)+1;
    highlighter.naturalHeight = Math.abs(y1-y2)+1;
    endSelectArea();
  }
}
function endSelectArea() {
  selectingArea = false;
  selectAreaCallback(pos1, pos2);
}