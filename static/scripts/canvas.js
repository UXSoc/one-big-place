const colorsArrayRGB = [
  [107, 1, 25], [189, 0, 55], [255, 69, 0], [254, 168, 0], [255, 212, 53], [254, 248, 185], [1, 162, 103], [9, 204, 118],
  [126, 236, 87], [2, 117, 109], [0, 157, 170], [0, 204, 190], [39, 127, 164], [55, 144, 234], [82, 232, 243], [72, 57, 191],
  [105, 91, 255], [148, 179, 255], [128, 29, 159], [180, 73, 191], [228, 171, 253], [221, 17, 126], [254, 55, 129], [254, 153, 169],
  [109, 70, 47], [155, 105, 38], [254, 180, 112], [0, 0, 0], [82, 82, 82], [136, 141, 144], [213, 214, 216], [255, 255, 255]
]

export function loadCanvas(canvas) {
  fetch(`json/canvas`)
  .then(response => response.json()) 
  .then(array2D => {
    const rows = array2D.length;
    const cols = array2D[0].length;
  
    canvas.width = cols;
    canvas.height = rows;
    canvas.ctx = canvas.getContext("2d");
  
    const imageData = canvas.ctx.createImageData(cols, rows);
    const data = imageData.data;
  
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const color = colorsArrayRGB[array2D[y][x]] || [255, 255, 255]; // Default to white
            const index = (y * cols + x) * 4;
            data[index] = color[0];
            data[index + 1] = color[1];
            data[index + 2] = color[2];
            data[index + 3] = 255;
        }
    }
  
    canvas.ctx.putImageData(imageData, 0, 0);
    canvas.parentElement.updateSize();
    canvas.parentElement.center();
  }) 
}
