const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../src/routes/");
const connectToDatabase = require("../src/config/database");

const app = express();

// Middleware
app.use(bodyParser.json());

// menjalankan database
//connectToDatabase();

app.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server Node.js!");
});

// Routes
app.use(routes);

// jika user mengakses url yang tidak ada maka server akan mengirimkan respon berikut
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, message: "Ups, something went wrong" });
});

module.exports = app;
