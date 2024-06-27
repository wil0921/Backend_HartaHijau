const router = require("express").Router();
const { walletController } = require("../controllers");

router.post("/", walletController.createUserWallet);

// Route mendapatkan wallet pengguna
router.get("/", walletController.getUserWalletById);

module.exports = router;
