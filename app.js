const express = require("express");
const app = express();
const pgp = require('pg-promise')(/*options*/);

const dbuser = process.env.DBUSER;
const dbpass = process.env.DBPASS;
const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const dbname = process.env.DBNAME;
const cn = `postgres://${dbuser}:${dbpass}@${dbhost}:${dbport}/${dbname}`;
const db = pgp(cn);

const path = require('path');
const port = 3000;

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: path.join(__dirname)});
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

app.listen(port, () => {
  console.log(`listening on port ${port} ( http://localhost:${port}/ )`);
})
