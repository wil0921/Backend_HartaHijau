const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersModel = require('../models/users.model')

const connectToDatabase = require("../config/database");

// Register controller
const register = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

  try {
    // check if user already register
    const [user] = await usersModel.getUserById()

    // authentication
    if (user.length) {
      return res.status(400).json({
        status: false,
        message: "Nomor telepon sudah terdaftar",
      });
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password, saltRounds);

    // insert new user into db
    const query =
      "INSERT INTO users (phoneNumber, username, password, verified) VALUES (?, ?, ?, ?)";
    const values = [phoneNumber, username, hashedPassword, false];
    const [result] = await pool.query(query, values);

    // sending otp into new user
    sendOTPVerification(result, res);
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(400).json({
      status: false,
      message: "Terjadi kesalahan saat menambah user",
      error: err.message,
    });
  }
};

const sendOTPVerification = async ({ id, phoneNumber }, res) => {
  try {
    // create otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    // twilio config
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const ACCOUNT_ID = process.env.ACCOUNT_ID;
    const AUTH_TOKEN = process.env.AUTH_TOKEN;
    const TWILIO_CLIENT = twilio(ACCOUNT_ID, AUTH_TOKEN);

    // send otp using twilio
    await TWILIO_CLIENT.messages.create({
      body: `Kode OTP Anda: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    //hashing otp
    const saltRounds = 10;
    const hashedOTP = bcrypt.hash(otp, saltRounds);

    // insert otp into db
    const pool = await connectToDatabase();
    const query =
      "INSERT INTO otp_verifications (userId, otp, createdAt, expiresAt) VALUES (?, ?, ?, ?)";
    const values = [id, hashedOTP, Date.now(), Date.now() + 3600000]; // expires in 1 hour
    await pool.query(query, values);

    return res.status(200).json({
      status: false,
      message: "Kode OTP telah dikirimkan ke nomor telepon Anda",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengirimkan OTP",
      error: err.message,
    });
  }
};

// Verify User controller
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  // authentication
  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Harap cantumkan userId",
    });
  } else if (!otp) {
    return res.status(401).json({
      status: false,
      message: "Kode OTP tidak boleh kosong",
    });
  }

  try {
    const pool = await connectToDatabase();
    const [OTPVerificationRecord] = await pool.query(
      `SELECT * FROM otp_verification WHERE userId = ?`,
      [userId]
    );

    // validate otp verification record
    if (OTPVerificationRecord.length <= 0) {
      return res.status(404).json({
        message:
          "nomor tersebut sudah terverifikasi. silahkan login atau signup",
      });
    }

    const { expiresAt } = OTPVerificationRecord[0];

    // validate expired otp
    if (Date.now() > expiresAt) {
      // delete expired otp verification
      await pool.query("DELETE FROM otp_verifications WHERE userId = ?", [
        userId,
      ]);
      return res.status(401).json({
        status: false,
        message:
          "Maaf, kode otp tersebut telah kadaluarsa. Silahkan kirim permintaan OTP lagi.",
      });
    }

    const hashedOTP = OTPVerificationRecord[0].otp;
    const validOTP = bcrypt.compare(otp, hashedOTP);
    // validate not valid otp
    if (!validOTP) {
      return res.status(401).json({
        status: false,
        message:
          "Maaf, kode otp yang anda masukkan salah. Silahkan periksa lagi.",
      });
    }

    // update user that success otp verification
    const query = "UPDATE users SET verified = ? WHERE id = ?";
    const values = [true, userId];
    await pool.query(query, values);
    // delete success otp verification
    await pool.query("DELETE FROM otp_verifications WHERE id = ?", [userId]);

    //generate jwt token
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const token = jwt.sign({ userId: user.id }, "secret_key", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: true,
      message: "nomor berhasil terverifikasi",
      token,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat memverifikasi OTP",
      error: err.message,
    });
  }
};

// Login controller
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    // search user by phone number
    const pool = await connectToDatabase();
    const [user] = await pool.query(
      "SELECT * FROM users WHERE phoneNUmber = ?",
      [phoneNumber]
    );
    // authentication
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ status: false, message: "Nomor telepon atau password salah" });
    }

    //generate jwt token
    const token = jwt.sign({ userId: user.id }, "secret_key", {
      expiresIn: "1h",
    });

    //login success
    res.status(200).json({ status: true, message: "Berhasil login", token });
  } catch (err) {
    console.error("Error login:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mencoba login.",
      error: err.message,
    });
  }
};

// Secure User controller
const secureAuth = (req, res) => {
  res.json({ message: "Akses diizinkan" });
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { phoneNumber, password } = req.body;
  // Validasi input phoneNumber
  if (!phoneNumber) {
    return res.status(400).json({
      status: false,
      message: "Nomor telepon diperlukan.",
    });
  }

  try {
    // check if user exist
    const pool = await connectToDatabase();
    const [user] = await pool.query(
      "SELECT * FROM users WHERE phoneNumber = ?",
      [phoneNumber]
    );

    // if user doesn't exist
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Nomor telepon tidak terdaftar / salah.",
      });
    }

    // Validasi input password
    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Kata sandi baru diperlukan.",
      });
    }

    // update user password
    const query = "UPDATE users SET password = ? WHERE phoneNumber = ?";
    const values = [password, phoneNumber];
    const updatedUser = await pool.query(query, values);

    return res.status(200).json({
      status: true,
      message: "Password berhasil diperbarui",
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({
      status: false,
      message:
        "Terjadi kesalahan saat mengganti password. Silakan coba lagi nanti.",
      error: err.message,
    });
  }
};

//menggabungkan semua auth controller kedalam 1 variabel agar mudah dikelola
const authController = {
  register,
  verifyOTP,
  login,
  secureAuth,
  forgotPassword,
};
module.exports = authController;
