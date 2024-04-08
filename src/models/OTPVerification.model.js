const prisma = require("../config/database");

const addRecord = (newOTPRecord) => {
  const { userId, otp, createdAt, expiresAt } = newOTPRecord;
  const query = ` INSERT INTO otp_verifications (userId, otp, createdAt, expiresAt) 
                    VALUES (?, ?, ?, ?)`;
  const values = [userId, otp, createdAt, expiresAt];

  return pool.query(query, values);
};

const getRecordById = (userId) => {
  const query = "SELECT * FROM otp_verifications WHERE userId = ?";
  const values = [userId];

  return pool.query(query, values);
};

const deleteRecordById = (userId) => {
  const query = "DELETE FROM otp_verifications WHERE userId = ?";
  const values = [userId];

  return pool.query(query, values);
};

module.exports = {
  addRecord,
  getRecordById,
  deleteRecordById
};
