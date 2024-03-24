const router = require('express').Router();

const transferBalance = require('../controllers/transactions.controller');

router.post(transferBalance);

module.exports = router;