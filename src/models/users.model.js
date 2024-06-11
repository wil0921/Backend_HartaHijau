const { User } = require("../../sequelize/sequelize");

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

const updateUserById = (field, value, id) => {
  const data = { [field]: value };
  return User.update({ data }, { where: { id } });
};

const deleteUserById = (id) => User.destroy({ where: { id } });

module.exports = {
  createNewUser,
  getAllUser,
  getUserById,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
};
