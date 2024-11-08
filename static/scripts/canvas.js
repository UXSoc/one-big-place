export function loadCanvas(canvas) {
    // sample load canvas function
    canvas.ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = './static/images/sample.png';
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        console.log(img.clientWidth, img.clientHeight)
        canvas.ctx.drawImage(img, 0, 0);
        canvas.parentElement.updateSize();
        canvas.parentElement.center();
      }
}