const { Transaction_history } = require("../../sequelize/sequelize");
const { v4: uuidv4 } = require("uuid");

const createHistory = (
  transactionId,
  senderId,
  recipientId,
  amount,
  transactionType
) => {
  return Transaction_history.create({
    id: uuidv4(),
    transactionId,
    transactionDate: new Date(),
    transactionType,
    senderId,
    recipientId,
    amount,
  });
};

const getAllHistory = () => Transaction_history.findAll();

module.exports = {
  createHistory,
  getAllHistory,
};
