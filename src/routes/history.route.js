const router = require("express").Router();
const historyController = require("../controllers/historyController");

router.get("/history", historyController.getHistory);

module.exports = router;
