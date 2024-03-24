const transferBalance = async (req, res) => {
  const { sender, receiver, amount } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("Users");

  // if sender poin is not enought
  if (sender.poin < amount) {
    return res.status(400).json({
      status: false,
      message: "Poin anda tidak cukup.",
    });
  }

  // Step 1: Start a Client Session
  const session = client.startSession();

  // Step 2: Optional. Define options to use for the transaction
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
  try {
    await session.withTransaction(async () => {
      // update sender poin
      await collection.updateOne(
        { sender: sender._id },
        { poin: sender.poin - amount },
        { session }
      );
      // update receiver poin
      await collection.updateOne(
        { sender: receiver._id },
        { poin: receiver.poin + amount },
        { session }
      );

      return res.status(200).json({
        status: true,
        message: `Berhasil mengirim ${amount} poin ke ${receiver}`,
      });
    }, transactionOptions);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengirim poin",
      error: err.message,
    });
  } finally {
    await session.endSession();
    await client.close();
  }
};

module.exports = transferBalance;
