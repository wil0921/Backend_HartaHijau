const router = require('express').Router();
const { authController } = require('../controllers');
const authMiddleware = require('../middleware/auth.middleware');

// Route register
router.post('/register', authController.register);

// Route verify user
router.post('/verify', authController.verifyOTP);

// Route login
router.post('/login', authController.login);

// Route forgot password
router.post('/forgotpassword', authController.forgotPassword);

// Route secure user
router.get('/secure', authMiddleware.authenticateToken, authController.secureAuth);

module.exports = router;
