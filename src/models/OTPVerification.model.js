const prisma = require("../config/database");

const addRecord = (newOTPRecord) => {
  const { userId, otp, createdAt, expiresAt } = newOTPRecord;
  return prisma.otp_verification.create({
    data: {
      userId,
      otp,
      createdAt,
      expiresAt,
    },
  });
};

const getRecordById = (userId) => prisma.otp_verification.findUnique({ where: { userId } });

const deleteRecordById = (userId) => prisma.otp_verification.delete({ where: { userId } });

module.exports = {
  addRecord,
  getRecordById,
  deleteRecordById,
};
