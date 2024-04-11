const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersModel = require("../models/users.model");
const profileModel = require("../models/profile.model");
const OTPVerificationModel = require("../models/OTPVerification.model");

// Register controller
const register = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

  try {
    // check if user already register
    const [user] = await usersModel.getUserByPhoneNumber(phoneNumber);

    // authentication
    if (user.length) {
      return res.status(400).json({
        status: false,
        message:
          "Nomor telepon sudah terdaftar, silahkan gunakan nomor lain atau login.",
      });
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password, saltRounds);

    const newUser = {
      id: uuidv4(),
      phoneNumber,
      username,
      hashedPassword,
      verified: false,
    };

    // insert new user into db
    const result = await usersModel.createNewUser(newUser);

    // sending otp into new user
    await sendOTPVerification(result);

    result.verified ? await profileModel.createUserProfile(result.id) : null;

    return res.status(200).json({
      status: true,
      message: "Pengguna berhasil mendaftar. Silahkan login.",
    });
  } catch (err) {
    console.error("Error saat menambahkan pengguna:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const sendOTPVerification = async ({ id, phoneNumber }, res) => {
  // create otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  // twilio config
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const AUTH_TOKEN = process.env.AUTH_TOKEN;
  const TWILIO_CLIENT = twilio(ACCOUNT_ID, AUTH_TOKEN);

  try {
    // send otp using twilio
    await TWILIO_CLIENT.messages.create({
      body: `Kode OTP Anda: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    //hashing otp
    const saltRounds = 10;
    const hashedOTP = bcrypt.hash(otp, saltRounds);

    const newOTPRecord = {
      userId: id,
      hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    // insert otp record into db
    await OTPVerificationModel.addRecord(newOTPRecord);

    return res.status(200).json({
      status: true,
      message: "Kode OTP telah dikirimkan ke nomor telepon Anda",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
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
    const OTPVerificationRecord = await OTPVerificationModel.getRecordById(
      userId
    );

    // validate otp verification record
    if (OTPVerificationRecord.length <= 0) {
      return res.status(404).json({
        message: "nomor tersebut sudah terverifikasi. silahkan login.",
      });
    }

    const { expiresAt } = OTPVerificationRecord[0];

    // validate expired otp
    if (Date.now() > expiresAt) {
      // delete expired otp verification
      await OTPVerificationModel.deleteRecordById(userId);
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

    // verified user that success otp verification
    await usersModel.updateUserById("verified", true, userId);
    // delete success otp verification record
    await OTPVerificationModel.deleteRecordById(userId);

    //generate jwt token
    const token = jwt.sign({ userId }, "secret_key", {
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
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

// Login controller
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    // search user by phone number
    const user = await usersModel.getUserByPhoneNumber(phoneNumber);
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
    return res
      .status(200)
      .json({ status: true, message: "Berhasil login", token });
  } catch (err) {
    console.error("Error login:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
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
    const user = await usersModel.getUserByPhoneNumber(phoneNumber);

    // if user doesn't exist
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Nomor telepon tidak terdaftar / salah.",
      });
    }

    // Validasi input password
    if (!password || user.password == password) {
      return res.status(400).json({
        status: false,
        message: "Kata sandi baru diperlukan.",
      });
    }

    // update user password
    const updatedUser = await usersModel.updateUserById(
      "password",
      password,
      user.id
    );

    return res.status(200).json({
      status: true,
      message: "Password berhasil diperbarui",
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
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
