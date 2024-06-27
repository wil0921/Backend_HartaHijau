const { User, Wallet } = require("../../sequelize/db/models/index");

const createNewUser = (newUser) => {
  const { id, phoneNumber, username, password, verified } = newUser;
  return User.create({
    id,
    phone_number: phoneNumber,
    username,
    password,
    verified,
  });
};

const getAllUser = () => User.findAll();

const getUserById = (id) => User.findOne({ where: { id } });

const getUserByPhoneNumber = (phoneNumber) => {
  return User.findOne({ where: { phone_number: phoneNumber } });
};

const updateUserById = (userId, fields) => {
  return User.update(fields, {
    where: { id: userId },
  });
};

const deleteUserById = (id) => User.destroy({ where: { id } });

const getUserProfileById = (id) => {
  return User.findOne({
    where: { id },
    attributes: ["id", "username", "profile_picture"],
    include: [
      {
        model: Wallet,
        attributes: ["total_withdrawl", "total_earn"],
      },
    ],
  });
};

const getDetailUserProfileById = (id) => {
  return User.findOne({
    where: { id },
    attributes: ["id", "username", "phone_number", "email", "createdAt"],
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserById,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
  getUserProfileById,
  getDetailUserProfileById,
};
