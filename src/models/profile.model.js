const pool = require('../config/database');

const getUserProfileById = (id) => {
  const query = ` SELECT user.username, user.profile_picture, poin.total_withdrawl, poin.total_earning
                  FROM user
                  INNER JOIN poin 
                  ON user.id = poin.user_id
                  WHERE user.id = ?`;
  const values = [id];

  return pool.query(query, values);
};

const getDetailUserProfileById = (id) => {
  const query =
    "SELECT, username, phone_number, email, createdAt FROM user WHERE id = ?";
  const values = [id];

  return pool.query(query, values);
};

const updateUserProfileById = (id, fields) => {
  const setClause = Object.keys(fields)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(fields);
  values.push(id);

  const query = `UPDATE users SET ${setClause} WHERE id = ?`;

  return pool.query(query, values);
};

module.exports = {
  getUserProfileById,
  getDetailUserProfileById,
  updateUserProfileById
}