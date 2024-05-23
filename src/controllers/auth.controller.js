const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const usersModel = require("../models/users.model");
const profileModel = require("../models/profile.model");
const OTPVerificationModel = require("../models/OTPVerification.model");
const { generateOTP, hashData, CustomError } = require("../utils");

// Register controller
const register = async (req, res, next) => {
  const { phoneNumber, username, password } = req.body;

  try {

    // check req body 
    if ( !phoneNumber || !username || !password ) {
      return res.status(400).json({
        status: false,
        message:
          "Tidak sesuai dengan ketentuan register kami!",
      });
    }

    // check if user already register
    const existingUser = await usersModel.getUserByPhoneNumber(phoneNumber);

    // authentication
    if (existingUser) {
      if (existingUser.verified) {
        // If user is already verified
        throw new CustomError.ClientError(
          "Nomor telepon sudah terverifikasi, silahkan gunakan nomor lain atau login."
        ).setStatusCode(400);
      } else {
        return res.status(200).json({
          status: true,
          message:
            "Nomor telepon sudah terdaftar tetapi belum terverifikasi. Silahkan melakukan verifikasi.",
          existingUser,
        });
      }
    }

    // hashing password
    const hashedPassword = await hashData(password);

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
    next(err);
  }
};

const sendOTPVerification = async (req, res, next) => {
  const { phoneNumber } = req.body;

  try {
    // check if user exist
    const existingUser = await usersModel.getUserByPhoneNumber(phoneNumber);

    //authentication
    if (!existingUser) {
      throw new CustomError.ClientError(
        "Nomor telepon belum terdaftar. Silahkan register atau gunakan nomor lain"
      ).setStatusCode(404);
    }

    // create otp
    const otp = generateOTP();
    const message = `kode otp anda adalah: ${otp}`;

    // config wa gateway
    const waGatewayApiEndPoint = "http://localhost:88/wa/api/v1/send-message";
    const data = {
      session: "mysession",
      to: phoneNumber,
      text: message,
    };

    // send http request otp using axios
    await axios.post(waGatewayApiEndPoint, data);

    //hashing otp
    const hashedOTP = await hashData(otp);

    const newOTPRecord = {
      userId: existingUser.id,
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
    next(err);
  }
};

// Verify User controller
const verifyOTP = async (req, res, next) => {
  const { userId, otp } = req.body;

  // authentication
  if (!userId) {
    throw new CustomError.ClientError("Harap cantumkan userId.").setStatusCode(
      401
    );
  }

  if (!otp) {
    throw new CustomError.ClientError(
      "Harap cantumkan kode OTP."
    ).setStatusCode(401);
  }

  try {
    const OTPVerificationRecord = await OTPVerificationModel.getRecordById(
      userId
    );

    // validate otp verification record
    if (!OTPVerificationRecord) {
      throw new CustomError.ClientError(
        "Pengguna sudah terverifikasi. Silahkan login."
      ).setStatusCode(404);
    }

    const { expiresAt } = OTPVerificationRecord;

    // validate expired otp
    if (Date.now() > expiresAt) {
      // delete expired otp verification
      await OTPVerificationModel.deleteRecordById(userId);

      throw new CustomError.ClientError(
        "Maaf, kode otp tersebut telah kadaluarsa. Silahkan kirim permintaan OTP lagi."
      ).setStatusCode(401);
    }

    const hashedOTP = OTPVerificationRecord.otp;
    const validOTP = bcrypt.compare(otp, hashedOTP);

    // validate not valid otp
    if (!validOTP) {
      throw new CustomError.ClientError(
        "Maaf, kode OTP yang anda masukkan salah. Silahkan periksa lagi."
      ).setStatusCode(404);
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
    next(err);
  }
};

// Login controller
const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  let data = {};
  try {

    console.log('phoneNumber', phoneNumber);
    console.log('password', password);
    if ( !phoneNumber  || !password ) {
      return res.status(400).json({
        status: false,
        message:
          "Tidak sesuai dengan ketentuan kami!",
      });
    }

    // search user by phone number
    const user = await usersModel.getUserByPhoneNumber(phoneNumber);
    // check user ada atau tidak
    if ( !user ) {
      console.log('user', user) ;
      return res.status(404).json({
        status: false,
        message:
          "Nomor telepon tidak ditemukan",
      });
    }

    // isi object data dengan user
    data.username = user.username;
    data.phone_number = user.phone_number;

    // decrpt hashed password & compare it
    const hashedPassword = user.password;
    const validPassword = bcrypt.compare(password, hashedPassword);

    // authentication
    if (!user) {
      throw new CustomError.ClientError(
        "Nomor telepon salah, silahkan coba lagi dengan nomor lain"
      ).setStatusCode(404);
    }

    if (!validPassword) {
      throw new CustomError.ClientError(
        "password salah, silahkan coba lagi dengan password lain."
      ).setStatusCode(404);
    }

    if (!user.verified) {
      // throw new Error(
      //   "Pengguna belum melakukan verifikasi, silahkan melakukan verifikasi terlebih dahulu."
      // ).setStatusCode(401);
      return res.status(400).json({
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
      .json({ status: true, message: "Berhasil login", token, data });
  } catch (err) {
    console.error("Error login:", err);
    next(err);
  }
};

// Secure User controller
const secureAuth = (req, res, next) => {
  res.json({ message: "Akses diizinkan" });
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  // authentication
  if (!userId) {
    throw new CustomError.ClientError("Harap cantumkan userId.").setStatusCode(
      401
    );
  }

  if (!otp) {
    throw new CustomError.ClientError(
      "Harap cantumkan kode OTP."
    ).setStatusCode(401);
  }

  if (!newPassword) {
    throw new CustomError.ClientError(
      "Harap cantumkan password baru."
    ).setStatusCode(401);
  }

  try {
    const OTPVerificationRecord = await OTPVerificationModel.getRecordById(
      userId
    );

    // validate otp verification record
    if (!OTPVerificationRecord) {
      throw new CustomError.ClientError(
        "Pengguna sudah terverifikasi. Silahkan login."
      ).setStatusCode(404);
    }

    const { expiresAt } = OTPVerificationRecord;

    // validate expired otp
    if (Date.now() > expiresAt) {
      // delete expired otp verification
      await OTPVerificationModel.deleteRecordById(userId);

      throw new CustomError.ClientError(
        "Maaf kode OTP tersebut sudah kadaluarsa. Silahkan melakukan permintaan OTP lagi."
      ).setStatusCode(401);
    }

    const hashedOTP = OTPVerificationRecord.otp;
    const validOTP = await bcrypt.compare(otp, hashedOTP);

    // validate not valid otp
    if (!validOTP) {
      throw new CustomError.ClientError(
        "Maaf kode OTP yang anda masukkan salah. Silahkan periksa lagi."
      ).setStatusCode(401);
    }

    // hashing password
    const hashedPassword = await hashData(newPassword);

    // reset password that success otp verification
    const updatedUser = await usersModel.updateUserById(
      "password",
      hashedPassword,
      userId
    );

    return res.status(200).json({
      status: true,
      message: "Password berhasil diperbarui",
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    next(err);
  }
};

//menggabungkan semua auth controller kedalam 1 variabel agar mudah dikelola
const authController = {
  register,
  sendOTPVerification,
  verifyOTP,
  login,
  secureAuth,
  resetPassword,
};
module.exports = authController;
