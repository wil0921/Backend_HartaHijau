const generateOTP = require("./generateOTP");
const validator = require("./validator");
const hashData = require("./hashData");
const CustomError = require("./error");

module.exports = { generateOTP, validator, hashData, CustomError };
