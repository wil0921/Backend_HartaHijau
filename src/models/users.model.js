const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phoneNumber: Number,
  password: String,
  verified: Boolean,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
