const init_canvas_size = [512,512]
const fs = require('fs');

function parseFile(path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({}, null, 2), 'utf8');
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}
function writeJSONFile(filename, data) {
    fs.writeFileSync(`./json/${filename}.json`, JSON.stringify(data), function(err, result) {
        if(err) console.log('error', err);
        console.log('\x1b[32m', `File Written: ${filename}.json`, '\x1b[0m')
    });
}
function initialize_empty_canvas() {
    var [width, height] = init_canvas_size
    console.log(`Initializing empty ${width} x ${height} canvas`)
    var canvas = {"width": width, "height": height, "canvas": []}
    var user_grid = {"width": width, "height":height, "user_grid": []}
    for (let i = 0; i<height; i++) {
        var row = []
        var user_row = []
        for (let j = 0; j<width; j++) {
            row.push(31)
            user_row.push(null)
        }
        canvas["canvas"].push(row)
        user_grid["user_grid"].push(user_row)
    }
    writeJSONFile("canvas", canvas)
    writeJSONFile("canvas_users", user_grid)
}

var canvas = {
    "canvas": [],
    "user_grid": [],
}
function load_canvas() {
    if (!fs.existsSync('./json')) {
        fs.mkdirSync('./json', { recursive: true });
        console.log('json directory created');
        initialize_empty_canvas();
    }
    canvas.canvas = parseFile("./json/canvas.json")["canvas"]
    canvas.user_grid = parseFile("./json/canvas_users.json")["user_grid"]
}
function get_canvas_json() {
    return canvas.canvas
}
function get_user_grid_json() {
    return canvas.user_grid
}
module.exports = {
    load_canvas: load_canvas,
    get_canvas_json: get_canvas_json,
    get_user_grid_json: get_user_grid_json,
};