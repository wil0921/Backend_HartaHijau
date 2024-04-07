const profileModel = require("../models/profile.model");

const getUserProfileById = async (req, res) => {
  const id = req.query.id;

  try {
    const [profile] = await profileModel.getUserProfileById(id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil profile pengguna",
      profile,
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

const getDetailUserProfileById = async (req, res) => {
  const id = req.query.id;

  try {
    const [profileDetails] = await profileModel.getDetailUserProfileById(id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil detail profile pengguna",
      profileDetails,
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

const updateUserProfileById = async (req, res) => {
  const id = req.query.id;
  const { profilePicture, username, phoneNumber, email, password } = req.body;
  const fields = { profilePicture, username, phoneNumber, email, password };

  try {
    const [updatedProfile] = await profileModel.updateUserProfileById(
      id,
      fields
    );

    return res.status(200).json({
      status: true,
      message: "Berhasil mengupdate profile pengguna",
      updatedProfile,
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

module.exports = {
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById,
};
