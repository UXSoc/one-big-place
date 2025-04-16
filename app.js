require('dotenv').config()
const { PrismaClient } = require("./generated/prisma");
const express = require("express");
const session = require("express-session");
const sharedSession = require('express-socket.io-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const app = express();
const prisma = new PrismaClient();
const port = process.env.APP_PORT || 3000;
const saltRounds = 10;

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  idNumber: Joi.string().pattern(/^\d{6}$/).required(),
  password: Joi.string().pattern(/^\d{6}$/).required(),
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username.length === 0 || password.length === 0) {
        return done(null, false, { message: "No username or password given"});
      }
      let match;
      // const value = await schema.validateAsync({ username: username, password: password, confirmPassword: password });
      // const validatedUsername = value["username"];
      // const validatedPassword = value["password"];
      const user = await prisma.user.findUnique({
        where: {
          username: username.toLowerCase(),
        }
      })
      if (user !== null) {
        match = await bcrypt.compare(password, user.password);
      }
      if (user === null) {
        return done(null, false, { message: "User does not exist" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    }
    catch(err) {
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
  }
  catch(err) {
    done(err);
  }
});

const sessionMiddleware = session({
  secret: "cats",
  resave: false,
  saveUninitialized: false
});

app.use(express.static("static"));
app.use(sessionMiddleware);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile("html/index.html", {root: path.join(__dirname)});
})

app.get("/register", (req, res) => {
  res.sendFile("html/auth/register.html", {root: path.join(__dirname)});
})

app.post("/register", async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const value = await schema.validateAsync({ username: username, idNumber: req.body.id_number, password: req.body.password, confirmPassword: req.body.confirmPassword });
    const validatedUsername = value["username"];
    const validatedPassword = value["password"];
    const validatedIDNumber = parseInt(value["idNumber"]);
    let hashedPassword;
    hashedPassword = await bcrypt.hashSync(validatedPassword, saltRounds);
    await prisma.user.create({
      data: {
        username: validatedUsername,
        password: hashedPassword,
        idNumber: validatedIDNumber,
      },
    });
    console.log(`Registered user: ${validatedUsername} ${validatedPassword}`)
    res.redirect("/?success=Registration+successful&open-modal=login");
  } catch(err) {
    console.error(err);
    let errorMessage = "Registration+failed";
    
    // Joi validation errors
    if (err.isJoi) {
      errorMessage = err.details[0].message.replace(/ /g, '+');
    }
    // Prisma errors
    else if (err.code === 'P2002') {
      errorMessage = "Username+already+taken";
    }
    
    res.redirect(`/?error=${errorMessage}&open-modal=register`);
  }
})

app.get("/login", (req, res) => {
  res.sendFile("html/auth/login.html", {root: path.join(__dirname)});
})

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect(`/?error=${encodeURIComponent(info.message)}&open-modal=login`);
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/?success=Login+successful");
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/html/:dir/:filename", (req, res) => {
  const dir = req.params.dir;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "html", dir, filename);
  if (path.extname(filename) !== ".html") {
    return res.status(403).send("Forbidden");
  }
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send(`File not found: ${filePath}`);
    }
  });
});

app.get('/json/canvas', (req, res) => {
  res.json(canvas.get_canvas_json());
});

app.get('/json/user_grid', (req, res) => {
  res.json(canvas.get_user_grid_json());
});

// Setup Socket.io
const fs = require('fs');

try {
    var options = {
      key: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/www.gemplo.com/chain.pem')
    };
} catch {
}

const httpServer = !!options 
  ? require('https').createServer(options, app) 
  : require('http').createServer(app);

var io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
httpServer.listen(port, () => {
  console.log(`HTTP and Socket.IO listening on port ${port}`);
});
io.use(sharedSession(sessionMiddleware, {
  autoSave: true  // Automatically save session changes
}));

const canvas = require('./modules/canvas');

io.sockets.on('connection', (socket) => {
  
  // if (!socket.handshake.session.passport?.user) {
  //   console.log('Unauthenticated connection');
  //   return socket.disconnect(); // Kick unauthenticated users
  // }

  // const userId = socket.handshake.session.passport.user;
  // console.log(`Authenticated user ${userId} connected`);

  socket.on('PaintPixel', (data) => {
    if (!socket.handshake.session.passport?.user) {
      socket.emit("request_login");
      return;
    }
    canvas.paintPixel(data.x, data.y, data.id)
    io.emit("PaintPixel", data)
  });
});

canvas.load_canvas()
canvas.saveFrame();

function cleanup() {
  console.log("Saving Data...")
  canvas.saveCanvasData();
  canvas.saveFrame(true);
}

process.on("SIGINT", () => {
  cleanup();
});
