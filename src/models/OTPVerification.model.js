const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  updatesAt: Date,
});

const OTPVerification = mongoose.model(
  "OTPVerification",
  OTPVerificationSchema
);

module.exports = OTPVerification;
