const usersModel = require("../models/users.model");
const { CustomError } = require("../utils");

const getAllUser = async (req, res, next) => {
  try {
    const users = await usersModel.getAllUser();

    if (!users.length) {
      throw new CustomError.ClientError(
        "Belum ada data pengguna untuk ditampilkan."
      ).setStatusCode(404);
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil semua pengguna",
      users,
    });
  } catch (err) {
    console.error("Error saat mengambil semua pengguna:", err);
    next(err);
  }
};

const deleteUserById = async (req, res, next) => {
  const id = req.query.id;

  if (!id) {
    throw new CustomError.ClientError(
      "Harap cantumkan id pengguna"
    ).setStatusCode(401);
  }

  try {
    const result = await usersModel.getUserById(id);

    if (!result) {
      throw new CustomError.ClientError(
        `Gagal menghapus, Pengguna dengan ID ${id} tidak ditemukan.`
      ).setStatusCode(404);
    }

    await usersModel.deleteUserById(id);

    return res.status(200).json({
      status: true,
      message: `Pengguna dengan ID ${id} berhasil dihapus`,
    });
  } catch (err) {
    console.error("Error saat menghapus user:", err);
    next(err);
  }
};

module.exports = { createNewUser, getAllUser, deleteUserById };
