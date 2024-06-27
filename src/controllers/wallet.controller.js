const walletModel = require("../models/wallet.model");

const createUserWallet = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Harap cantumkan userId",
      });
    }

    const isWalletExist = await walletModel.getUserWalletById(userId);

    if (isWalletExist) {
      return res.status(401).json({
        status: false,
        message: "Pengguna sudah memiliki wallet",
      });
    }

    const wallet = await walletModel.createUserWallet(userId);

    return res.status(400).json({
      status: true,
      message: "Berhasil membuat wallet pengguna",
      data: wallet,
    });
  } catch (error) {
    console.error("error saat membuat wallet pengguna: " + err);
    next(err);
  }
};

const getUserWalletById = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Harap cantumkan userId",
      });
    }

    const wallet = await walletModel.getUserWalletById(userId);

    if (!wallet) {
      return res.status(404).json({
        status: false,
        message: "Wallet dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(400).json({
      status: true,
      message: "Berhasil mengambil wallet berdasarkan id",
      data: wallet,
    });
  } catch (err) {
    console.error("error saat mendapatkan wallet pengguna: " + err);
    next(err);
  }
};

module.exports = {
  createUserWallet,
  getUserWalletById,
};
