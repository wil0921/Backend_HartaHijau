const router = require("express").Router();
const { authController } = require("../controllers");
const { authMiddleware } = require("../middleware");

// Route register
router.post("/register", authController.register);

// Route send otp verification
router.post('/otp/send', authController.sendOTPVerification);

// Route verify otp
router.post("/otp/verify", authController.verifyOTP);

// Route login
router.post("/login", authController.login);

// Route forgot password
router.post("/reset-password", authController.resetPassword);

// Route secure user
router.get(
  "/secure",
  authMiddleware.authenticateToken,
  authController.secureAuth
);

module.exports = router;
