const router = require("express").Router();
const { addUser, getAllUser, deleteUserById } = require("../controllers/users.controller");

// Route menambahkan data user
router.post(addUser);

// Route mendapatkan semua data user
router.get(getAllUser);

// Route untuk menghapus data berdasarkan ID
router.delete("/:id", deleteUserById);

module.exports = router;
