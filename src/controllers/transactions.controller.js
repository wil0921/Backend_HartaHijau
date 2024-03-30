const qr = require("qrcode");
const uploadImageToCloudinary = require("../utils/cloudinary");
const connectToDatabase = require("../config/database");

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
    const pool = await connectToDatabase();

    // start transaction
    pool.beginTransaction();

    // decrease sender poin
    const updateSenderQuery =
      "UPDATE FROM users SET poin = poin - ? WHERE id = ?";
    await pool.query(updateSenderQuery, [amount, sender.id]);

    // increase receiver poin
    const updateReceiverQuery =
      "UPDATE FROM users SET poin = poin + ? WHERE id = ?";
    await pool.query(updateReceiverQuery, [amount, receiver.id]);

    // commit changes
    await pool.commit();

    return res.status(200).json({
      status: true,
      message: `Berhasil mengirim ${amount} poin ke pengguna dengan nomor ${receiver.phoneNumber}`,
    });
  } catch (err) {
    // Rollback trnsactions if there's any error
    await pool.rollback();
    console.error("Error sending poin poin:", err);

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengirim poin",
      error: err.message,
    });
  } finally {
    // End the connection when finished
    await pool.end();
  }
};

const generateQRCode = async (req, res) => {
  const { phoneNumber, username } = req.body;

  // Verifikasi data user
  if (!phoneNumber || !username) {
    return res.status(400).json({
      status: false,
      message:
        "Kesalahan: Data pengguna tidak lengkap. Pastikan Anda menyediakan nomor telepon dan username.",
    });
  }

  try {
    const user = { phoneNumber, username };
    const stringUser = JSON.stringify(user);

    // Membuat kode QR
    const qrDataUrl = await qr.toDataURL(stringUser);

    // Upload gambar QR code ke Cloudinary
    const result = await uploadImageToCloudinary(qrDataUrl);

    return res.status(200).json({
      status: true,
      message: "Berhasil membuat kode QR",
      qr_code_url: result.secure_url,
    });
  } catch (err) {
    console.error("Error:", err);

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat membuat kode QR",
      error: err.message,
    });
  }
};

module.exports = { transferBalance, generateQRCode };
