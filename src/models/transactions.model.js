const { sequelize, User, Transaction_history } = require("../../sequelize/db/models");
const { v4: uuidv4 } = require("uuid");

const transferBalance = async (senderId, recipientId, amount) => {
  return await sequelize.transaction(async (trx) => {
    // 1. decrease sender poin balance
    const sender = await User.findOne(
      { where: { id: senderId } },
      { transaction: trx }
    );
    await sender.decrement({ balance: amount }, { transaction: trx });

    // 2. verify that the sender's poin balance didn't go below zero.
    if (sender.poin.balance < 0) {
      throw new Error(
        `${sender.username} tidak memiliki saldo yang cukup untuk mengirim ${amount} poin`
      );
    }

    // 3. increase recipient poin balance
    const recipient = await User.findOne(
      { where: { id: recipientId } },
      { transaction: trx }
    );
    await recipient.increment({ balance: amount }, { transaction: trx });

    const transactionHistory = await Transaction_history.create(
      {
        transactionId: uuidv4(),
        amount,
        senderId,
        recipientId,
        status: "succesful",
      },
      { transaction: trx }
    );

    return transactionHistory;
  });
};

module.exports = {
  transferBalance,
};
