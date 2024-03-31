const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

router.get('/news', newsController.getNews);

module.exports = router;
