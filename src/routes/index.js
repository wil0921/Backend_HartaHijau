const routes = require("express").Router();

const authRoute = require("./auth.route");

routes.use("/api/v1", authRoute);

module.exports = routes;
