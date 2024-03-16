const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../src/routes/");
const init = require('../src/config/connect')
const mongoose = require('mongoose')

const app = express();

// Mongoose connection
mongoose.connect('mongodb+srv://hartahijau:<mongodb@0m1>@cluster0.2t0ihsa.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(bodyParser.json());

// menjalankan database
init();

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
