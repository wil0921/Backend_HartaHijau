const express = require('express');
const newsRoute = express.Router();
const newsController = require('../controllers/news.controller');
const upload = require('../middleware/upload');

newsRoute.post('/', upload.single('thumbnail'), newsController.createNewNews);
newsRoute.get('/', newsController.getAllNews);

module.exports = newsRoute;