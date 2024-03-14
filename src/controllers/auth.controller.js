//file ini berfungsi untuk menangani request dari routes dan memberi respon

// Import library
const twilio = require("twilio");
// Import model
import usersModel from "../models/users.model";

require("dotenv");
/* dotenv itu package buat nyimpen data yang ga boleh di publish, kayak configurasi twilio
cara pakenya dengan menginstall donenv dan membuat file .env
oh iya konfigurasi twilionya udah di pindah ke file .env */

// Register controller
const register = (req, res) => {
  const { phoneNumber, username, password } = req.body;

  // authentication
  if (usersModel.users.some((u) => u.phoneNumber === phoneNumber)) {
    return res.status(400).json({ message: "Nomor telepon sudah terdaftar" });
  }

  // create otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // send otp using twilio
  process.env.TWILIO_CLIENT.messages
    .create({
      body: `Kode OTP Anda: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    .then(() => {
      users.push({ phoneNumber, username, password, otp });
      res.json({ message: "Kode OTP telah dikirimkan ke nomor telepon Anda" });
    })
    .catch((err) => {
      console.error("Error sending OTP:", err);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengirimkan OTP" });
    });
};

// Verify User controller
const verifyAuth = (req, res) => {
  const { phoneNumber, otp } = req.body;
  // search user by phone number
  const user = usersModel.users.find((u) => u.phoneNumber === phoneNumber);

  // authentication
  if (!user || user.otp !== otp) {
    return res.status(401).json({ message: "Kode OTP tidak valid" });
  }

  //generate jwt token
  const token = jwt.sign({ userId: user.id }, "secret_key", {
    expiresIn: "1h",
  });

  res.json({ token });
};

// Login controller
const login = (req, res) => {
  const { phoneNumber, password } = req.body;
  // search user by phone number
  const user = usersModel.users.find((u) => u.phoneNumber === phoneNumber);

  // authentication
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "Nomor telepon atau password salah" });
  }

  //generate jwt token
  const token = jwt.sign({ userId: user.id }, "secret_key", {
    expiresIn: "1h",
  });

  res.json({ token });
};

// Secure User controller
const secureAuth = (req, res) => {
  res.json({ message: "Akses diizinkan" });
};

//menggabungkan semua auth controller kedalam 1 variabel agar mudah dikelola
const authController = { register, verifyAuth, login, secureAuth };
export default authController;
