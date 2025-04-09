const fs = require('fs');
const { createCanvas } = require('canvas')
const init_canvas_size = [64,64]
const colorsArray = [
    '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
    '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
    '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
    '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];
const saveFrame_interval = 5*60*1000; // save frame every 5 minutes (for timelapse)
const saveCanvas_interval = 60*1000; // save canvas to JSON every minute

function parseFile(path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({}, null, 2), 'utf8');
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function writeJSONFile(filename, data) {
    fs.writeFileSync(`./canvas_data/${filename}.json`, JSON.stringify(data), function(err, result) {
        if(err) console.log('error', err);
        console.log('\x1b[32m', `File Saved: ${filename}.json`, '\x1b[0m')
    });
}

function initialize_empty_canvas() {
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
    writeJSONFile("canvas", canvas)
}

var canvas = {"canvas": [],"user_grid": []}
function load_canvas() {
    if (!fs.existsSync('./canvas_data')) {
        fs.mkdirSync('./canvas_data', { recursive: true });
        console.log('canvas_data directory created');
        initialize_empty_canvas();
    }
    var parsedCanvas = parseFile("./canvas_data/canvas.json")
    canvas.canvas = parsedCanvas["canvas"]
    canvas.user_grid = parsedCanvas["user_grid"]
    saveFrame()
}

function get_canvas_json() {
    return canvas.canvas
}

function get_user_grid_json() {
    return canvas.user_grid
}

function convertTZ(date) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "Asia/Taipei"}));   
}

function formatDate(date) {
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = String(date.getFullYear()).slice(-2);
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}${day}${year}-${hours}${minutes}${seconds}`;
}

async function saveFrame() {
    if (!fs.existsSync('./canvas_data/timelapse'))  fs.mkdirSync('./canvas_data/timelapse', { recursive: true });
    var width = canvas.canvas[0].length
    var height = canvas.canvas.length
    var frame_canvas = createCanvas(width, height)
    var ctx = frame_canvas.getContext('2d')
    for (i=0;i<height;i++) {
        for (j=0;j<width;j++) {
            ctx.fillStyle = colorsArray[canvas.canvas[i][j]];
            ctx.fillRect(j, i, 1, 1)
        }
    }
    var buffer = frame_canvas.toBuffer('image/png')
    var d = new Date();
    var d_tz = convertTZ(d)
    await fs.writeFile(`./canvas_data/timelapse/${formatDate(d_tz)}.png`, buffer, function(err, result) {
        if(err) console.log('error', err);
        console.log('\x1b[32m', 'Frame saved', '\x1b[0m')
    })
}

function paintPixel(x,y,id) {
    canvas.canvas[y][x] = id
    console.log(`placed pixel: ${x} ${y} ${id}`)
}

setTimeout(() => {
    writeJSONFile("canvas", canvas)
}, saveCanvas_interval)

setTimeout(() => {
    saveFrame()
}, saveFrame_interval)

module.exports = {
    load_canvas: load_canvas,
    get_canvas_json: get_canvas_json,
    get_user_grid_json: get_user_grid_json,
    paintPixel: paintPixel,
};