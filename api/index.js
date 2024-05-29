const express = require("express");
const path = require("path");
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
app.set("view engine", "ejs");
app.set("views",  path.join(__dirname, "../whatsapp-api/app/views"));
app.use(serverMiddleware.logRequestTime);
app.use(serverMiddleware.maintenanceMode);

app.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server Node.js!");
});

// Routes
app.use("/api/v1", routes);
app.use("/wa/api/v1", whatsappApi.MainRouter);

// jika user mengakses url yang tidak ada maka server akan mengirimkan respon berikut
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, message: "Ups, something went wrong" });
});

// Error handling middleware
app.use(errorMiddleware.responseError);

module.exports = app;
