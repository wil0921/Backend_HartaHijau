const prisma = require("../config/database");

const createNewUser = (newUser) => {
  const { phoneNumber, username, hashedPassword, verified } = newUser;
  return prisma.user.create({
    data: {
      phoneNumber: phoneNumber,
      username: username,
      password: hashedPassword,
      verified: verified,
    },
  });
};

const getAllUser = () => prisma.user.findMany();

const getUserById = (id) => prisma.user.findUnique({ where: { id } });

const getUserByPhoneNumber = (phoneNumber) => {
  return prisma.user.findUnique({ where: { phone_number: phoneNumber } });
};

const updateUserById = (field, value, id) => {
  const data = { [field]: value };
  return prisma.user.update({ where: { id }, data });
};

const deleteUserById = (id) => prisma.user.delete({ where: { id } });

module.exports = {
  createNewUser,
  getAllUser,
  getUserById,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
};
