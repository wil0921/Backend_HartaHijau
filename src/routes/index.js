const routes = require("express").Router();

const authRoute = require("./auth.route");
const userRoute = require('./users.route');
const transactionRoute = require('./transactions.route')

routes.use("/auth", authRoute);
routes.use("/users", userRoute);
routes.use('/transactions', transactionRoute);

module.exports = routes;
