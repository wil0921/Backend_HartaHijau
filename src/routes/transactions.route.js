const router = require("express").Router();

const {
  transferBalance,
  generateQRCode,
} = require("../controllers/transactions.controller");

router.post('/send', transferBalance);
router.post('/generate-qrcode', generateQRCode);

module.exports = router;
