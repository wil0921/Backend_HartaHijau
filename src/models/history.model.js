const prisma = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const createHistory = async (transactionId, senderId, recipientId, amount, transactionType) => {
  return await prisma.transaction_history.create({
    data: {
      id: uuidv4(),
      transactionId,
      transactionDate: new Date(),
      transactionType,
      senderId,
      recipientId,
      amount,
    },
  });
};

const getAllHistory = async () => {
  return await prisma.transaction_history.findMany();
};

module.exports = {
  createHistory,
  getAllHistory,
};
