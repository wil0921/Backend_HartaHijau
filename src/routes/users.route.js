const router = require("express").Router();
const { usersController } = require("../controllers");

// Route menambahkan data user
router.post("/", usersController.createNewUser);

// Route mendapatkan semua data user
router.get("/", usersController.getAllUser);

// Route untuk menghapus data berdasarkan ID
router.delete("/", usersController.deleteUserById);

module.exports = router;
