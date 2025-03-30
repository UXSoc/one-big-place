require('dotenv').config()
const {Sequelize} = require("sequelize");
const express = require("express");
const app = express();

const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const cn = `postgres://${dbuser}:${dbpass}@${dbhost}:${dbport}/${dbname}`;
const sequelize = new Sequelize(cn);

const path = require('path');
const port = 3000;

app.use(express.static("static"));

sequelize.authenticate().then(() => {
  console.log("Connection to database has been established successfully.");
}).catch((error) => {
  console.error("Unable to connect to the database:", error);
  });

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: path.join(__dirname)});
})

app.get("/register", (req, res) => {
  res.sendFile("register.html", {root: path.join(__dirname)});
})

app.get("/login", (req, res) => {
  res.sendFile("login.html", {root: path.join(__dirname)});
})

app.get("/modals/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "modals", filename);
  if (path.extname(filename) !== ".html") {
    return res.status(403).send("Forbidden");
  }
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

app.get('/json/canvas', (req, res) => {
  res.json(canvas.get_canvas_json());
});

app.get('/json/user_grid', (req, res) => {
  res.json(canvas.get_user_grid_json());
});

app.listen(port, () => {
  console.log(`listening on port ${port} ( http://localhost:${port}/ )`);
})


// Setup Socket.io
const SOCKETPORT = process.env.SOCKETPORT;
const fs = require('fs');

try {
    var options = {
      key: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/chain.pem')
    };
} catch {
}

var socket_app = express()
if (!!options) {
    const https = require('https');
    var server = https.createServer(options, socket_app)
} else {
    const https = require('http');
    var server = https.createServer(socket_app)
}
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
server.listen(SOCKETPORT);
console.log(`SocketIO Server Started on port ${SOCKETPORT}`)

const canvas = require('./modules/canvas');

io.sockets.on('connection', (socket) => {
  console.log(`${socket.request.connection.remoteAddress} connected`);
  socket.on('PaintPixel', (data) => {
    canvas.paintPixel(data.x, data.y, data.id)
    io.emit("PaintPixel", data)
  });
});

canvas.load_canvas()
