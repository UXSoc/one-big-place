require('dotenv').config()
const { PrismaClient } = require("./generated/prisma");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const prisma = new PrismaClient();
const port = process.env.APP_PORT || 3000;
const saltRounds = 10;

app.use(express.static("static"));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let match;
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        }
      })
      
      if (user !== null) {
        match = await bcrypt.compare(password, user.password);
      }
      if (user === null) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      }
    })

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: path.join(__dirname)});
})

app.get("/register", (req, res) => {
  res.sendFile("register.html", {root: path.join(__dirname)});
})

app.post("/register", async (req, res, next) => {
  try {
    let hashedPassword;
    hashedPassword = await bcrypt.hashSync(req.body.password, saltRounds);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
})

app.get("/login", (req, res) => {
  res.sendFile("login.html", {root: path.join(__dirname)});
})

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

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
  console.log(`Listening on port ${port} ( http://localhost:${port}/ )`);
})

// Setup Socket.io
const SOCKETPORT = process.env.SOCKET_PORT;
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
