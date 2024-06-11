const { Profile } = require("../../sequelize/sequelize");

const createUserProfile = (userId) => {
  return Profile.create({ userId });
};

const getUserProfileById = (userId) => {
  return Profile.findOne({
    where: { userId },
    attributes: ["profile_picture"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Poin,
        attributes: ["total_withdrawl", "total_earning"],
      },
    ],
  });
};

const getDetailUserProfileById = (userId) => {
  return Profile.findOne({
    where: { userId },
    select: {
      email: true,
      createdAt: true,
      user: { select: { username: true, phone_number: true } },
    },
  });
};

const updateUserProfileById = (userId, fields) => {
  return Profile.update(
    { fields },
    {
      where: { userId },
    }
  );
};

module.exports = {
  createUserProfile,
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById,
};
