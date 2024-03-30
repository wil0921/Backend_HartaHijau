const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const connectToDatabase = require("../config/database");

// Register controller
const register = async (req, res) => {
  const { phoneNumber, username, password } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("Users");
  const user = await collection.find({ phoneNumber });

  // authentication
  if (user.length) {
    return res.status(400).json({
      status: false,
      message: "Nomor telepon sudah terdaftar",
    });
  }

  //hashing password
  const saltRounds = 10;
  const hashedPassword = bcrypt.hash(password, saltRounds);

  // input user into db
  const newUser = {
    phoneNumber,
    username,
    password: hashedPassword,
    verified: false,
  };

  // saving user into db (will return the new user)
  try {
    const result = await collection.insertOne(newUser);
    // sending otp into new user
    sendOTPVerification(result, res);
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(400).json({
      status: false,
      message: "Terjadi kesalahan saat menambah user",
      error: error.message,
    });
  }
};

const sendOTPVerification = async ({ _id, phoneNumber }, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("OTP_Verification");
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

    // input otp into db
    const newOTPVerification = {
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // expires in 1 hour
    };

    // saving otp into db
    await collection.insertOne(newOTPVerification);

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
  const db = await connectToDatabase();
  const user = db.collection("Users").find({ phoneNumber });

  // authentication
  if (!userId || !otp) {
    return res.status(401).json({
      status: false,
      message: "Kode OTP tidak boleh kosong",
    });
  }

  const OTPVerificationRecord = db
    .collection("OTP_verification")
    .find({ userId });

  // if verification data record doesn't exist
  if (OTPVerificationRecord.length <= 0) {
    return res.status(404).json({
      message: "nomor tersebut sudah terverifikasi. silahkan login atau signup",
    });
  }

  const { expiresAt } = OTPVerificationRecord[0];
  const hashedOTP = OTPVerificationRecord[0].otp;

  // if otp already expired
  if (Date.now() > expiresAt) {
    // delete verification otp if already expired
    await db.collection("OTP_verification").deleteMany({ userId });
    return res.status(401).json({
      status: false,
      message:
        "Maaf, kode otp tersebut telah kadaluarsa. Silahkan kirim permintaan OTP lagi.",
    });
  }

  const validOTP = bcrypt.compare(otp, hashedOTP);
  // if otp doesn't valid
  if (!validOTP) {
    return res.status(401).json({
      status: false,
      message: "Maaf, kode otp yang anda masukkan. Silahkan periksa lagi.",
    });
  }

  // if verification success
  await db.collection("User").updateOne({ _id: userId }, { verified: true });
  // delete verification otp if already expired
  await db.collection("OTP_verification").deleteMany({ userId });

  //generate jwt token
  const token = jwt.sign({ userId: user.id }, "secret_key", {
    expiresIn: "1h",
  });

  return res.status(200).json({
    status: true,
    message: "nomor berhasil terverifikasi",
    token,
  });
};

// Login controller
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("Users");
  // search user by phone number
  const user = await collection.find((u) => u.phoneNumber === phoneNumber);

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

  const db = await connectToDatabase();
  const collection = db.collection("Users");

  try {
    // check if user exist
    const user = await collection.findOne({ phoneNumber });

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

    const updatedUser = await collection.updateOne(
      { phoneNumber },
      { password }
    );

    return res.status(200).json({
      status: true,
      message: "Password berhasil diperbarui",
      updatedUser,
    });
  } catch (err) {
    console.error(err);
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
