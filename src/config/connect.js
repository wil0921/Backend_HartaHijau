const mongoose = require("mongoose");

// connection
const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Berhasil tersambung ke database!");
  } catch (err) {
    console.log("Gagal tersambung ke database! Alasan:", err.message);
  }
};

module.exports = init;
