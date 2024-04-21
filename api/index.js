const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("../src/routes/");
const { serverMiddleware } = require("../src/middleware");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serverMiddleware.logRequestTime);
app.use(serverMiddleware.maintenanceMode);

app.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server Node.js!");
});

// Routes
app.use("/api/v1", routes);

// jika user mengakses url yang tidak ada maka server akan mengirimkan respon berikut
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, message: "Ups, something went wrong" });
});

module.exports = app;
