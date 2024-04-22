const profileModel = require("../models/profile.model");

const createUserProfile = async (req, res, next) => {
  const { id } = req.query.id;
  try {
    const result = await profileModel.createUserProfile(id);

    return res.status(200).json({
      status: true,
      message: "Berhasil membuat profile pengguna",
      result,
    });
  } catch (err) {
    console.error("Error saat membuat profile:", err);
    next(err);
  }
};

const getUserProfileById = async (req, res, next) => {
  const id = req.query.id;

  try {
    const profile = await profileModel.getUserProfileById(id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil profile pengguna",
      profile,
    });
  } catch (err) {
    console.error("Error saat mengambil data profile:", err);
    next(err)
  }
};

const getDetailUserProfileById = async (req, res, next) => {
  const id = req.query.id;

  try {
    const profileDetails = await profileModel.getDetailUserProfileById(id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil detail profile pengguna",
      profileDetails,
    });
  } catch (err) {
    console.error("Error saat mengambil detail profile:", err);
    next(err)
  }
};

const updateUserProfileById = async (req, res, next) => {
  const id = req.query.id;
  const { profilePicture, username, phoneNumber, email, password } = req.body;
  const fields = { profilePicture, username, phoneNumber, email, password };

  try {
    const updatedProfile = await profileModel.updateUserProfileById(id, fields);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengupdate profile pengguna",
      updatedProfile,
    });
  } catch (err) {
    console.error("Error saat mengambil semua pengguna:", err);
    next(err)
  }
};

module.exports = {
  createUserProfile,
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById,
};
