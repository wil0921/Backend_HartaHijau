const { validationResult, check } = require('express-validator');
const News = require('../models/news.model');

const validateNewsInput = [
  check('title').notEmpty().withMessage('Title is required'),
  check('description').notEmpty().withMessage('Description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const checkNewsExistence = async (req, res, next) => {
  const newsId = req.params.id;
  try {
    const news = await News.findByPk(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    req.news = news;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const newsMiddleware = {
  validateNewsInput,
  checkNewsExistence
};

module.exports = newsMiddleware;