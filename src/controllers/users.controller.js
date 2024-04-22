const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // to generate unique random id
const usersModel = require("../models/users.model");
const { hashData } = require("../utils");

const createNewUser = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

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
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await usersModel.getAllUser();

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil semua pengguna",
      users,
    });
  } catch (err) {
    console.error("Error saat mengambil semua pengguna:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.query.id;

  try {
    const result = await usersModel.getUserById(id);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: `Gagal menghapus, Pengguna dengan ID ${id} tidak ditemukan.`,
      });
    }

    await usersModel.deleteUserById(id);

    return res.status(200).json({
      status: true,
      message: `Pengguna dengan ID ${id} berhasil dihapus`,
    });
  } catch (err) {
    console.error("Error saat menghapus user:", err);

    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menghapus user",
      error: err.message,
    });
  }
};

module.exports = { createNewUser, getAllUser, deleteUserById };
