const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const usersModel = require("../models/users.model");
const profileModel = require("../models/profile.model");
const OTPVerificationModel = require("../models/OTPVerification.model");
const { generateOTP } = require("../utils");

// Register controller
const register = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

  try {
    // check if user already register
    const isUserExist = await usersModel.getUserByPhoneNumber(phoneNumber);

    // authentication
    if (isUserExist) {
      if (isUserExist.verified) {
        // If user is already verified
        return res.status(400).json({
          status: false,
          message:
            "Nomor telepon sudah terverifikasi, silahkan gunakan nomor lain atau login.",
        });
      } else {
        return res.status(200).json({
          status: true,
          message:
            "Nomor telepon sudah terdaftar tetapi belum terverifikasi. Silahkan melakukan verifikasi.",
          isUserExist,
        });
      }
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      id: uuidv4(),
      phoneNumber,
      username,
      password: hashedPassword,
      verified: false,
    };

    // insert new user into db
    const newUser = await usersModel.createNewUser(userData);

    return res.status(200).json({
      status: true,
      message: "Pengguna berhasil mendaftar. Silahkan melakukan verifikasi.",
      newUser,
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

const sendOTPVerification = async (req, res) => {
  const { phoneNumber, userId } = req.body;

  try {
    // check if user exist
    const isUserExist = usersModel.getUserByPhoneNumber(phoneNumber);

    //authentication
    if (isUserExist) {
      // If user is already verified
      if (isUserExist.verified) {
        return res.status(400).json({
          status: false,
          message:
            "Nomor telepon sudah terverifikasi, silahkan gunakan nomor lain atau login.",
        });
      }
    } else {
      return res.status(200).json({
        status: true,
        message:
          "Nomor telepon belum terdaftar. Silahkan register atau gunakan nomor lain",
      });
    }

    // create otp
    const otp = generateOTP();
    const message = `kode otp anda adalah: ${otp}`;

    // config wa gateway
    const waGatewayApiEndPoint = "http://localhost:5001/send-message";
    const data = {
      session: "mysession",
      to: phoneNumber,
      text: message,
    };

    // send http request otp using axios
    await axios.post(waGatewayApiEndPoint, data);

    //hashing otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPRecord = {
      userId,
      otp: hashedOTP,
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 3600000),
    };

    // insert otp record into db
    await OTPVerificationModel.addRecord(newOTPRecord);

    return res.status(200).json({
      status: true,
      message: `kode otp telah berhasil dikirim ke nomor ${phoneNumber}. Silahkan melakukan verifikasi otp`,
    });
  } catch (err) {
    console.error("Error saat mengirimkan OTP:", err);

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
    if (!OTPVerificationRecord) {
      return res.status(404).json({
        message: "Pengguna sudah terverifikasi. silahkan login.",
      });
    }

    console.log(OTPVerificationRecord);
    const { expiresAt } = OTPVerificationRecord;

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

    const hashedOTP = OTPVerificationRecord.otp;
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
    //create user profile
    await profileModel.createUserProfile(userId);

    //generate jwt token
    const token = jwt.sign({ userId }, "secret_key", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: true,
      message: "Pengguna berhasil terverifikasi",
      token,
    });
  } catch (err) {
    console.error("Error verifikasi OTP:", err);

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

    // decrpt hashed password & compare it
    const hashedPassword = user.password;
    const validPassword = bcrypt.compare(password, hashedPassword);

    // authentication
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Nomor telepon salah, silahkan coba lagi dengan nomor lain",
      });
    }

    if (!validPassword) {
      return res.status(401).json({
        status: false,
        message: "password salah, silahkan coba lagi dengan password lain.",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        status: false,
        message:
          "Pengguna belum melakukan verifikasi, silahkan melakukan verifikasi terlebih dahulu.",
      });
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
  sendOTPVerification,
  verifyOTP,
  login,
  secureAuth,
  forgotPassword,
};
module.exports = authController;
