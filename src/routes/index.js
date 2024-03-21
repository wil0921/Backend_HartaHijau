const routes = require("express").Router();

const authRoute = require("./auth.route");
const userRoute = require('./users.route');

routes.use("/api/v1", authRoute);
routes.use("/api/v1/users", userRoute);

module.exports = routes;
