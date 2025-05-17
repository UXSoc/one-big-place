const fs = require('fs');
const { createClient } = require("@supabase/supabase-js");
const { createCanvas } = require('canvas');
const { getCurrentDate, isEventClosed } = require('./ess');
const init_canvas_size = [64,64]
const colorsArray = [
    '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
    '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
    '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
    '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];
const saveFrame_interval = 5*60*1000; // save frame every 5 minutes (for timelapse)
const saveCanvas_interval = 60*1000; // save canvas to JSON every minute

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function parseFile(filename) {
    const { data, error } = await supabase
        .storage
        .from('data')
        .download(filename);

    if (error) {
        console.log('File not found, initializing new:', filename);
        await writeJSONFile(filename, {}); // create empty file if not found
        return {};
    }

    const text = await data.text();
    return JSON.parse(text);
}

async function writeJSONFile(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

    const { error } = await supabase
        .storage
        .from('data')
        .upload(filename, blob, {
            upsert: true
        });

    if (error) {
        console.error('Upload failed:', error.message);
    } else {
        console.log('\x1b[32m', `File Saved: ${filename}`, '\x1b[0m');
    }
}

async function initialize_empty_canvas() {
    var [width, height] = init_canvas_size
    console.log(`Initializing empty ${width} x ${height} canvas`)
    var canvas = {"width": width, "height": height, "canvas": [], "user_grid": []}
    for (let i = 0; i<height; i++) {
        var row = []
        var user_row = []
        for (let j = 0; j<width; j++) {
            row.push(31)
            user_row.push(null)
        }
        canvas["canvas"].push(row)
        canvas["user_grid"].push(user_row)
    }
    await writeJSONFile("canvas.json", canvas)
}

var canvas = {"canvas": [],"user_grid": []}
async function load_canvas() {
    const { data, error } = await supabase
        .storage
        .from('data')
        .download("canvas.json");

    if (error) {
        await initialize_empty_canvas();
    }

    var parsedCanvas = await parseFile("canvas.json");
    canvas.canvas = parsedCanvas["canvas"];
    canvas.user_grid = parsedCanvas["user_grid"];
}

function get_canvas_json() {
    return canvas.canvas;
}

function get_user_grid_json() {
    return canvas.user_grid;
}

function formatDate(dateTime) {
    let month = String(dateTime.month).padStart(2, '0');
    let day = String(dateTime.day).padStart(2, '0');
    let year = String(dateTime.year).slice(-2);
    let hours = String(dateTime.hour).padStart(2, '0');
    let minutes = String(dateTime.minute).padStart(2, '0');
    let seconds = String(dateTime.second).padStart(2, '0');
    return `${month}${day}${year}-${hours}${minutes}${seconds}`;
}
async function saveFrame(close_on_exit=false) {
    var width = canvas.canvas[0].length;
    var height = canvas.canvas.length;
    var frame_canvas = createCanvas(width, height);
    var ctx = frame_canvas.getContext('2d');
    for (i=0;i<height;i++) {
        for (j=0;j<width;j++) {
            ctx.fillStyle = colorsArray[canvas.canvas[i][j]];
            ctx.fillRect(j, i, 1, 1);
        }
    }
    var buffer = frame_canvas.toBuffer('image/png');
    var d = getCurrentDate();

    const { error } = await supabase
        .storage
        .from('data')
        .upload(`/timelapse/${formatDate(d)}.png`, buffer, {
            contentType: 'image/png',
            upsert: true,
        });

    if (error) {
        console.error('Failed to save frame:', error.message);
    } else {
        console.log('\x1b[32m', 'Frame saved to Supabase', '\x1b[0m');
    }
    if (close_on_exit) process.exit(0);
}

function paintPixel(x, y, id, userId) {
    canvas.canvas[y][x] = id;
    canvas.user_grid[y][x] = userId;
    console.log(`placed pixel: ${x} ${y} ${id}`);
}

function getPixelColorId(x, y) {
    return canvas.canvas[y][x] || 31;
}

function saveCanvasData() {
    console.log('\x1b[32m', 'Canvas data saved', '\x1b[0m')
    writeJSONFile("canvas.json", canvas)
}

setInterval(() => {
    if (!isEventClosed()) saveCanvasData();
}, saveCanvas_interval)

setInterval(() => {
    saveFrame(false);
}, saveFrame_interval)

function createSeededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;

    return function() {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function fillArea(x1, y1, x2, y2, randomFill, color, seed ) {
    const isInvalid = (v) => v === undefined || v === null || isNaN(v);
    if ([x1, y1, x2, y2].some(isInvalid)) throw new Error('Invalid coordinates: One or more values are undefined, null, or NaN.');
    if (color<0 || color>=colorsArray.length) throw new Error('Invalid color id.');
    const max = colorsArray.length;
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    const height = canvas.canvas.length;
    const width = canvas.canvas[0]?.length ?? 0;
    if (
        startX < 0 || startY < 0 ||
        endX >= width || endY >= height
    ) {
        throw new Error("Coordinates are out of canvas bounds.");
    }
    const rand = (randomFill)?(seed !== null ? createSeededRandom(seed):Math.random):null;
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const colorId = (randomFill)?(Math.floor(rand()*(max+1))):color;
        canvas.canvas[y][x] = colorId;
      }
    }
}

function resize(width, height) {
    if (typeof width !== 'number' || isNaN(width) || typeof height !== 'number' || isNaN(height) || width <= 0 || height <= 0 ) {
        console.error('Invalid width or height: Must be numbers, not null/undefined, and greater than 0.');
        return;
    }
    const resizedCanvas = [];
    const resizedUserGrid = [];
    for (let y = 0; y < height; y++) {
        const rowCanvas = [];
        const rowUserGrid = [];
        for (let x = 0; x < width; x++) {
            rowCanvas.push(canvas.canvas[y]?.[x] ?? colorsArray.length-1); // Preserve old value if it exists, else fill with null
            rowUserGrid.push(canvas.user_grid[y]?.[x] ?? null);
        }
        resizedCanvas.push(rowCanvas);
        resizedUserGrid.push(rowUserGrid);
    }
    canvas.canvas = resizedCanvas;
    canvas.user_grid = resizedUserGrid;
}

module.exports = {
    load_canvas: load_canvas,
    get_canvas_json: get_canvas_json,
    get_user_grid_json: get_user_grid_json,
    paintPixel: paintPixel,
    fillArea: fillArea,
    resize: resize,
    getPixelColorId: getPixelColorId,
    saveFrame: saveFrame,
    saveCanvasData: saveCanvasData,
};