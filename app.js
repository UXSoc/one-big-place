require('dotenv').config()
const fs = require('fs');
const { PrismaClient } = require("./generated/prisma");
const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");
const sharedSession = require('express-socket.io-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { DateTime } = require("luxon");
const { cacheUserFromDB, startDBSyncing, user, updateUser, getLeaderboard, getUserPlaceCountByYear, cacheYearStats, updateYearStats, getYearStats } = require('./modules/user');

const app = express();
const prisma = new PrismaClient();
const port = process.env.APP_PORT || 3000;
const saltRounds = 10;

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  idNumber: Joi.string().pattern(/^(?:\d{4}|\d{6}|\d{9})$/).required(),
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
      const user = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive"
          }
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

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sessionMiddleware = session({
  store: new PgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),
  secret: "cats",
  resave: false,
  saveUninitialized: false
});
app.use(express.static("static"));
app.use(sessionMiddleware);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const openingDate = DateTime.fromFormat(process.env.OPENING_DATE, "LLL d, yyyy HH:mm:ss", { zone: "Asia/Manila" });
  const closingDate = DateTime.fromFormat(process.env.CLOSING_DATE, "LLL d, yyyy HH:mm:ss", { zone: "Asia/Manila" });
  const stopAccessClosingDate = closingDate.plus({ minutes: 30 });
  const now = DateTime.now().setZone("Asia/Manila");
  if (now < openingDate) {
    res.sendFile("html/landing.html", {root: path.join(__dirname)});
  } else if (now > stopAccessClosingDate) {
    res.sendFile("html/closed.html", {root: path.join(__dirname)});
  } else {
    res.sendFile("html/index.html", {root: path.join(__dirname)});
  }
});

app.get("/json/opening-date", (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ openingDate: process.env.OPENING_DATE });
});

app.get("/json/closing-date", (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ closingDate: process.env.CLOSING_DATE });
});

app.get("/register", (req, res) => {
  res.sendFile("html/auth/register.html", {root: path.join(__dirname)});
})

app.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
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
      let redirectPath = "/?success=Login+successful";
      console.log(`First Login: ${user.firstLogin}`)
      if (user.firstLogin) {
        updateUser(prisma, user.id, {
          firstLogin: false,
        })
        redirectPath += "&firstLogin=true"
      }
      return res.redirect(redirectPath);
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
  res.setHeader('Cache-Control', 'no-store');
  res.json(canvas.get_canvas_json());
});

app.get('/json/user_grid', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(canvas.get_user_grid_json());
});

app.get('/json/challenges', (req, res) => {
  const filePath = path.join(__dirname, "server_json", "challenges.json");
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send(`File not found: ${filePath}`);
    }
  });
});

app.get('/json/user', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  res.setHeader('Cache-Control', 'no-store');
  res.json(await user(prisma, parseInt(req.user.id)));
});

app.get('/json/user/:userId', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const userId = req.params.userId;
  res.json(await user(prisma, parseInt(userId)));
});

app.get('/json/statistics/leaderboard', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(await getLeaderboard(prisma));
});

app.get('/json/statistics/yr_dist', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(await getUserPlaceCountByYear());
});

let promos;
function loadPromos() {
  const filePath = path.join(__dirname, "server_json", "promos.json");
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    promos = new Set(jsonData);
  } catch (err) {
    console.error('Error loading/parsing promos:', err);
  }
}
loadPromos();

app.use(express.json())
app.post('/redeem', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "User not authenticated" });
  const { redeemCode } = req.body;
  try {
    const message = await redeemCodeForUser(req.user.id, redeemCode);
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

async function redeemCodeForUser(userId, redeemCode) {
  if (typeof redeemCode !== 'string') { throw new Error("Invalid input. Must be a string.") }
  const redeemingUser = await user(prisma, parseInt(userId));
  if (!redeemingUser) { throw new Error("User not found") }
  if (redeemingUser.bonusSet.has(redeemCode)) { throw new Error("Redeem code already used") }
  if (!(promos.has(redeemCode) || (isChallenge(redeemCode) && isChallengeCompleted(redeemingUser, redeemCode)))) { throw new Error("Promo code not found") }
  await updateUser(prisma, redeemingUser.id, {
    bonus: [...(redeemingUser.bonus || []), redeemCode],
    bonusSet: new Set([...(redeemingUser.bonusSet || []), redeemCode]),
    maxBits: redeemingUser.maxBits + 1
  });
  return "Redeem code redeemed successfully!";
}

cacheYearStats(prisma);

// Setup Socket.io

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
const { calculateBits, getCooldown } = require('./modules/bits');
const { isChallenge, isChallengeCompleted } = require('./modules/challenges');
const { timeBetw, generateRandomSeed, isEventClosed } = require('./modules/ess');
startDBSyncing(prisma);

async function sync_cooldown(userId, socket) {
  const user_data = await user(prisma, userId);
  if (!user_data) return;
  const [current_bits, extraTime] = calculateBits(user_data.lastBitCount, user_data.maxBits, user_data.lastPlacedDate, user_data.extraTime)
  socket.emit("sync_cooldown", { current_bits: current_bits, extra_time: extraTime, maxBits: user_data.maxBits, bitGenerationInterval: getCooldown() })
}

function isLunch() {
  return timeBetw('11:00:00', '14:00:00')
}

io.sockets.on('connection', async (socket) => {
  let userId;
  console.log("Connected clients:", io.engine.clientsCount);

  io.emit('connected_clients', io.engine.clientsCount);

  socket.on('disconnect', () => {
    io.emit('connected_clients', io.engine.clientsCount);
  })

  if (socket.handshake.session.passport?.user) {
    userId = socket.handshake.session.passport.user;
    console.log(`Authenticated user ${userId} connected`);
    cacheUserFromDB(prisma, userId);
    sync_cooldown(userId, socket);
  } else {
    console.log('Unauthenticated connection');
  }
  socket.on('req_bit_sync', () => {
    sync_cooldown(userId, socket);
  })
  socket.on('PaintPixel', async (data) => {
    if (!socket.handshake.session.passport?.user) {
      socket.emit("request_login");
      socket.emit("PaintPixel", { ...data, id: canvas.getPixelColorId(data.x, data.y) })
      
      return;
    }
    const user_data = await user(prisma, userId);
    const [current_bits, extraTime] = calculateBits(user_data.lastBitCount, user_data.maxBits, user_data.lastPlacedDate, user_data.extraTime)
    if (current_bits < 1) {
      socket.emit("PaintPixel", { ...data, id: canvas.getPixelColorId(data.x, data.y) })
      return;
    }
    const canvasWidth = canvas.get_user_grid_json()[0].length;
    const canvasHeight = canvas.get_user_grid_json().length;
    
    if (!(data.x >= 0 && data.x < canvasWidth && data.y >= 0 && data.y < canvasHeight)) {
      socket.emit("PaintPixel", { ...data, id: canvas.getPixelColorId(data.x, data.y) })
      console.error("Invalid position. Attempted to place pixel outside of canvas.");
      return;
    }
    if (!isEventClosed()) {
      const pos_current_userId = canvas.get_user_grid_json()[data.y][data.x];
      await updateUser(prisma, userId, {
        lastBitCount: current_bits-1,
        placeCount: user_data.placeCount+1,
        replaced: (pos_current_userId&&pos_current_userId!==userId)?user_data.replaced+1:user_data.replaced,
        placedBreak: (isLunch())?user_data.placedBreak+1:user_data.placedBreak,
        lastPlacedDate: Date.now(),
        extraTime: extraTime,
      })
      
      const getYearId = (id) => {
        const str = id.toString();
        return parseInt((str.length>=4&&str.length!==6)?str.slice(2,4):((str.length>=2)?str.slice(0, 2):null));
      };
      const placer_yearId = getYearId(user_data.idNumber);
      const placer_yearData = await getYearStats(prisma, placer_yearId);
      if (pos_current_userId) {
        // replacing pixel
        const current_userData = await user(prisma, pos_current_userId);
        if (current_userData) {
          const current_yearId = getYearId(current_userData.idNumber);
          const current_yearData = await getYearStats(prisma, current_yearId);
          if (current_yearId!==placer_yearId) {
            await updateYearStats(prisma, current_yearId, {
              pixelCount: Math.max(0, current_yearData.pixelCount-1),
            })
            await updateYearStats(prisma, placer_yearId, {
              pixelCount: placer_yearData.pixelCount+1,
            })
          }
        } else {
          await updateYearStats(prisma, placer_yearId, {
            pixelCount: placer_yearData.pixelCount+1,
          })
        }
      } else {
        // Placing on empty pixel
        await updateYearStats(prisma, placer_yearId, {
          pixelCount: placer_yearData.pixelCount+1,
        })
      }
    } else {
      data.id = 31;
      canvas.paintPixel(data.x, data.y, data.id, userId);
      sync_cooldown(userId, socket);
      io.emit("PaintPixel", { ...data, userId: null });
      return;
    }
    canvas.paintPixel(data.x, data.y, data.id, userId);
    sync_cooldown(userId, socket);
    io.emit("PaintPixel", { ...data, userId: userId });
  });

  // admin tools
  socket.on("fill_area", (data) => {
    if (data.adminKey!==process.env.ADMIN_KEY) { console.error("Incorrect admin key."); return;};
    const fillSeed = generateRandomSeed();
    try {
      canvas.fillArea(data.x1, data.y1, data.x2, data.y2, data.randomFill, data.color, fillSeed);
      io.emit("fill_area", {...data, fillSeed: fillSeed})
    } catch (err) {
      console.error("Caught error:", err.message);
    }
  })
  socket.on("resize_canvas", (data) => {
    if (data.adminKey!==process.env.ADMIN_KEY) { console.error("Incorrect admin key."); return;};
    canvas.resize(data.width, data.height);
    io.emit("reload_canvas");
  })
  socket.on("reload_clients", (data) => {
    if (data.adminKey!==process.env.ADMIN_KEY) { console.error("Incorrect admin key."); return;};
    io.emit("force_reload");
  })
  socket.on("broadcast_message", (data) => {
    if (data.adminKey!==process.env.ADMIN_KEY) { console.error("Incorrect admin key."); return;};
    if (!data.heading || !data.message || typeof data.heading !== 'string' || data.heading == '' || typeof data.message !== 'string' || data.message == '') {
      console.error('Invalid heading or message: Must be non-empty strings.');
      return;
    }
    io.emit("broadcast_message", data);
  })
});

canvas.load_canvas()
canvas.saveFrame();

function cleanup() {
  if (!isEventClosed()) {
    console.log("Saving Data...")
    canvas.saveCanvasData();
  }
  // canvas.saveFrame(true);
  process.exit(0);
}

process.on("SIGINT", () => {
  cleanup();
});
