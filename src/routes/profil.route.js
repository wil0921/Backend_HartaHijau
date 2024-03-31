const express = require('express');
const multer = require('multer');
const router = express.Router();
const { upload } = require('./middlewares');
const { changeProfilePicture, logout, withdrawPoints, earnPoints } = require('./handlers');

router.post('/change_profile_picture', upload.single('new_picture'), changeProfilePicture);
router.get('/logout', logout);
router.post('/withdraw_points', withdrawPoints);
router.post('/earn_points', earnPoints);

module.exports = router;
