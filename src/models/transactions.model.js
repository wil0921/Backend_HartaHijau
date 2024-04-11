const prisma = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const transferBalance = async (senderId, recipientId, amount) => {
  return await prisma.$transaction(async (trx) => {
    // 1. decrease sender poin balance
    const sender = await trx.user.update({
      where: { id: senderId },
      data: {
        poin: { decrement: { balance: amount } },
      },
    });

    // 2. verify that the sender's poin balance didn't go below zero.
    if (sender.poin.balance < 0) {
      throw new Error(
        `${sender.username} tidak memiliki saldo yang cukup untuk mengirim ${amount} poin`
      );
    }

    // 3. increase recipient poin balance
    const recipient = await trx.account.update({
      where: { id: recipientId },
      data: {
        poin: { increment: { balance: amount } },
      },
    });

    const transactionHistory = await trx.transaction_history.create({
      data: {
        transactionId: uuidv4(),
        amount,
        senderId,
        recipientId,
        status: "succesful",
      },
    });

    return transactionHistory;
  });
};

module.exports = {
  transferBalance,
};
