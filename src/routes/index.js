const routes = require("express").Router();

const authRoute = require("./auth.route");
const userRoute = require('./users.route');
const transactionRoute = require('./transactions.route')

routes.use("/api/v1", authRoute);
routes.use("/api/v1/users", userRoute);
routes.use('/api/v1/transfer', transactionRoute);

module.exports = routes;
