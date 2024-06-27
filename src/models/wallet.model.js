const { Wallet } = require("../../sequelize/db/models");

const createUserWallet = (userId) => Wallet.create({ userId })

const getUserWalletById = (userId) => Wallet.findOne({ where: { userId } });

module.exports = {
  createUserWallet,
  getUserWalletById,
};
