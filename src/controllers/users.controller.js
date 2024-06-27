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

const getUserProfileById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({
      status: false,
      message: "Harap cantumkan ID pengguna",
    });
  }

  try {
    const profile = await usersModel.getUserProfileById(id);

    if (!profile) {
      return res.status(404).json({
        status: false,
        message: "Pengguna dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil profile pengguna",
      data: profile,
    });
  } catch (err) {
    console.error("Error saat mengambil data profile:", err);
    next(err);
  }
};

const getDetailUserProfileById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({
      status: false,
      message: "Harap cantumkan ID pengguna",
    });
  }

  try {
    const profileDetails = await usersModel.getDetailUserProfileById(id);

    if (!profileDetails) {
      return res.status(404).json({
        status: false,
        message: "Pengguna dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil detail profile pengguna",
      data: profileDetails,
    });
  } catch (err) {
    console.error("Error saat mengambil detail profile:", err);
    next(err);
  }
};

const updateUserProfileById = async (req, res, next) => {
  const { id } = req.params;
  const { profile_picture, username, phoneNumber, email, password } = req.body;
  const fields = { profile_picture, username, phoneNumber, email, password };

  if (!id) {
    return res.status(401).json({
      status: false,
      message: "Harap cantumkan ID pengguna",
    });
  }

  // Filter out undefined fields
  const filteredFields = {};
  for (const key in fields) {
    if (fields[key] !== undefined) {
      filteredFields[key] = fields[key];
    }
  }

  if (Object.keys(filteredFields).length === 0) {
    return res.status(401).json({
      status: false,
      message: "Harap cantumkan fields yang ingin diperbarui",
    });
  }

  try {
    const isUserExist = await usersModel.getUserById(id);

    if (!isUserExist) {
      return res.status(404).json({
        status: false,
        message: "Pengguna dengan ID tersebut tidak ditemukan",
      });
    }

    const updatedProfile = await usersModel.updateUserById(id, fields);

    if (updatedProfile === 0) {
      return res.status(404).json({
        status: false,
        message: "Pengguna dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil memperbarui pengguna",
      data: updatedProfile,
    });
  } catch (err) {
    console.error("Error saat memperbarui pengguna:", err);
    next(err);
  }
};

module.exports = {
  getAllUser,
  deleteUserById,
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById,
};
