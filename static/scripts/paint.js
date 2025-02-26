let timerLength = 5000; // in ms
let isTimerRunning = false;

export function paintPixel(color, coords) {
  // get current canvas
  const canvas = document.querySelector(".panner-container canvas");
  const ctx = canvas.getContext("2d");

  // paint the pixel onto the canvas (only if timer isn't running)
  // will need to wait for the canvas to load
  if (isTimerRunning == false) {
    ctx.fillStyle = color;
    ctx.fillRect(coords.x, coords.y, 1, 1);
    isTimerRunning = true;
    setTimeout(() => {
      isTimerRunning = false;
    }, timerLength);
  }

}
