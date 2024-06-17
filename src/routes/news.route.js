const express = require('express');
const newsRoute = express.Router();
const newsController = require('../controllers/news.controller');
const upload = require('../middleware/upload'); // Adjust the path as necessary

newsRoute.post('/news', upload.single('thumbnail'), newsController.createNews);
newsRoute.get('/news', newsController.getAllNews);

module.exports = newsRoute;