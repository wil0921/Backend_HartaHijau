const routes = require("express").Router();

const authRoute = require("./auth.route");
const userRoute = require("./users.route");
const transactionRoute = require("./transactions.route");
const newsRoute = require("./news.route");
const walletRoute = require("./wallet.route");
const productRoute = require("../utils/product.route");

routes.use("/auth", authRoute);
routes.use("/users", userRoute);
routes.use("/transactions", transactionRoute);
routes.use("/news", newsRoute);
routes.use("/wallet", walletRoute);
routes.use("/product", productRoute);

module.exports = routes;
