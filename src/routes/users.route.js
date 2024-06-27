const router = require("express").Router();
const { usersController } = require("../controllers");

// Route mendapatkan semua data user
router.get("/", usersController.getAllUser);

// Route untuk menghapus data berdasarkan ID
router.delete("/", usersController.deleteUserById);

router.get("/profile/:id", usersController.getUserProfileById);

router.put("/profile/:id", usersController.updateUserProfileById);

router.get("/profile/:id/detail", usersController.getDetailUserProfileById);

module.exports = router;
