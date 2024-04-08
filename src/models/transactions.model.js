const prisma = require("../config/database");

const transferBalance = async (sender, receiver, amount) => {
  try {
    // start transaction
    await pool.beginTransaction();

    // decrease sender poin
    const updateSenderQuery =
      "UPDATE FROM users SET poin = poin - ? WHERE id = ?";
    const updateSenderValues = [amount, sender.id];
    await pool.query(updateSenderQuery, updateSenderValues);

    // increase receiver poin
    const updateReceiverQuery =
      "UPDATE FROM users SET poin = poin + ? WHERE id = ?";
    const updateReceiverValues = [amount, receiver.id];
    await pool.query(updateReceiverQuery, updateReceiverValues);

    // commit changes
    await pool.commit();
  } catch (err) {
    // Rollback trnsactions if there's any error
    await pool.rollback();
  } finally {
    // End the connection when finished
    await pool.end();
  }
};

module.exports = {
  transferBalance,
};
