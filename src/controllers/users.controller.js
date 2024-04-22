const { v4: uuidv4 } = require("uuid"); // to generate unique random id
const usersModel = require("../models/users.model");
const { hashData, CustomError } = require("../utils");

const createNewUser = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

  if (!phoneNumber || !username || !password) {
    throw new CustomError.ClientError(
      "Masih ada data yang kosong, harap cantumkan data dengan lengkap."
    ).setStatusCode(403);
  }

  // hashing password
  const hashedPassword = hashData(password);

  try {
    const newUser = {
      id: uuidv4(),
      phoneNumber,
      username,
      hashedPassword,
      verified: false,
    };

    await usersModel.createNewUser(newUser);

    return res.status(201).json({
      status: true,
      message: "Berhasil menambahkan pengguna",
    });
  } catch (err) {
    console.error("Error saat menambahkan pengguna:", err);
    next(err);
  }
};

const getAllUser = async (req, res) => {
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

const deleteUserById = async (req, res) => {
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
