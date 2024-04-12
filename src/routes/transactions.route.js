const router = require("express").Router();

const { transactionsController } = require("../controllers");

router.post("/send", transactionsController.transferBalance);
router.post("/generate-qrcode", transactionsController.generateQRCode);

module.exports = router;
