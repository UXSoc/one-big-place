const fs = require('fs');

function parseFile(path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({}, null, 2), 'utf8');
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function initialize_empty_data() {
    var canvas = {"width": 64, "height": 64, "canvas": []}
    var user_grid = []

    for (let i = 0; i<64; i++) {
        var row = []
        var user_row = []
        for (let j = 0; j<64; j++) {
            row.push(31)
            user_row.push(null)
        }
        canvas["canvas"].push(row)
        user_grid.push(user_row)
    }
    fs.writeFileSync('./json/canvas.json', JSON.stringify(canvas), function(err, result) {
        if(err) console.log('error', err);
        console.log('\x1b[32m', 'Canvas initialized', '\x1b[0m')
    });
    fs.writeFileSync('./json/canvas_users.json', JSON.stringify(user_grid), function(err, result) {
        if(err) console.log('error', err);
        console.log('\x1b[32m', 'Canvas Users initialized', '\x1b[0m')
    });
}

function loadCanvas() {
    if (!fs.existsSync('./json')) {
        fs.mkdirSync('./json', { recursive: true });
        console.log('json directory created:', './json');
        initialize_empty_data()
    }
}

module.exports = {
    loadCanvas
};