const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("../src/routes/");
const { serverMiddleware, errorMiddleware } = require("../src/middleware");
const whatsappApi = require("../whatsapp-api/");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serverMiddleware.logRequestTime);
app.use(serverMiddleware.maintenanceMode);
app.use(errorMiddleware.handleError);

app.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server Node.js!");
});

// Routes
app.use("/api/v1", routes);
app.use("/wa/api/v1", whatsappApi.MainRouter);

// inisialisasi whatsapp server
whatsappApi.init();

// jika user mengakses url yang tidak ada maka server akan mengirimkan respon berikut
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, message: "Ups, something went wrong" });
});

module.exports = app;
