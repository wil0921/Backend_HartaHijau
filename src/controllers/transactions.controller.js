const qr = require("qrcode");
const uploadImageToCloudinary = require("../utils/cloudinary");
const transactionsModel = require("../models/transactions.model");
const { CustomError } = require("../utils");

const transferBalance = async (req, res, next) => {
  const { sender, receiver, amount } = req.body;

  // if sender poin is not enought
  if (sender.poin < amount) {
    return res.status(400).json({
      status: false,
      message: "Poin anda tidak cukup.",
    });
  }

  try {
    await transactionsModel.transferBalance(sender, receiver, amount);

    return res.status(200).json({
      status: true,
      message: `Berhasil mengirim ${amount} poin ke pengguna dengan nomor ${receiver.phoneNumber}`,
    });
  } catch (err) {
    console.error("Error sending poin poin:", err);
    next(err);
  }
};

const generateQRCode = async (req, res, next) => {
  const { phoneNumber, username } = req.body;

  // Verifikasi data user
  if (!phoneNumber || !username) {
    throw new CustomError.ClientError(
      "Data pengguna tidak lengkap. Pastikan Anda menyediakan nomor telepon dan username."
    );
  }

  try {
    const user = { phoneNumber, username };
    const stringUser = JSON.stringify(user);

    // Membuat kode QR
    const qrDataUrl = await qr.toDataURL(stringUser);

    // Upload gambar QR code ke Cloudinary
    const result = await uploadImageToCloudinary(qrDataUrl); // expired in 5 min

    return res.status(200).json({
      status: true,
      message: "Berhasil membuat kode QR",
      qr_code_url: result.secure_url,
    });
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

module.exports = { transferBalance, generateQRCode };
