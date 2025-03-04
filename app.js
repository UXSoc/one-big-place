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

app.listen(port, () => {
  console.log(`listening on port ${port} ( http://localhost:${port}/ )`);
})
