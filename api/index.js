const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes");

const app = express();

// middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server Node.js!");
});

// route
app.use(routes);

// jika user mengakses url yang tidak ada maka server akan mengirimkan respon berikut
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, message: "ups something went wrong" });
});

module.exports = app;