const usersController = require("./users.controller");
const authController = require("./auth.controller");
const transactionsController = require("./transactions.controller");
const historyController = require("./history.controller");
const newsController = require("./news.controller")
const walletController = require('./wallet.controller')

module.exports = {
  usersController,
  authController,
  transactionsController,
  historyController,
  newsController,
  walletController
};
