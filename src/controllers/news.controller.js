const newsModel = require('../models/news.model');

const getNews = (req, res) => {
  const newsData = newsModel.getNews();
  res.json(newsData);
};

module.exports = { getNews };
