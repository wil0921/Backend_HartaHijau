const prisma = require('../config/database');

const createNewUser = (newUser) => {
  const { phoneNumber, username, hashedPassword, verified } = newUser;
  const query = ` INSERT INTO users (phoneNumber, username, password, verified) 
                  VALUES (?, ?, ?, ?)`;
  const values = [phoneNumber, username, hashedPassword, verified];

  return pool.query(query, values);
};

const getAllUser = () => {
  return prisma.user.findMany();
};

const getUserById = (userId) => {
  const query = 'SELECT * FROM USER WHERE id = ?';
  const values = [userId];

  return pool.query(query, values)
}

const getUserByPhoneNumber = (phoneNumber) => {
  const query = 'SELECT * FROM USER WHERE phone_number = ?';
  const values = [phoneNumber];

  return pool.query(query, values)
}

const updateUserById = (field, value, userId) => {
  const query = `UPDATE users SET ${field} = ? WHERE id = ?`;
  const values = [value, userId];

  return pool.query(query, values)
};

const deleteUserById = (userId) => {
  const query = "DELETE FROM users WHERE id = ?";
  const values = [userId];

  return pool.query(query, values);
}

module.exports = {
  createNewUser,
  getAllUser,
  getUserById,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById
};
