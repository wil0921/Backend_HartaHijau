const { Otp_verification } = require("../../sequelize/db/models");

const addRecord = (newOTPRecord) => {
  const { userId, otp, expiresAt } = newOTPRecord;
  return Otp_verification.create({
    userId,
    otp,
    expiresAt,
  });
};

const getRecordById = (userId) =>
  Otp_verification.findOne({ where: { userId } });

const deleteRecordById = (userId) =>
  Otp_verification.destroy({ where: { userId } });

module.exports = {
  addRecord,
  getRecordById,
  deleteRecordById,
};
