const prisma = require("../config/database");

const getUserProfileById = (userId) => {
  return prisma.profile.findUnique({
    where: { userId },
    select: {
      profile_picture: true,
      user: { select: { username: true } },
      poin: { select: { total_withdrawl: true, total_earning: true } },
    },
  });
};

const getDetailUserProfileById = (userId) => {
  return prisma.profile.findUnique({
    where: { userId },
    select: {
      email: true,
      createdAt: true,
      user: { select: { username: true, phone_number: true } },
    },
  });
};

const updateUserProfileById = (userId, fields) => {
  return prisma.profile.update({
    where: { userId },
    data: fields,
  });
};

module.exports = {
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById,
};
