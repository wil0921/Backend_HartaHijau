const News = require('../models/news.model');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    let thumbnailUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      thumbnailUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      description,
      thumbnail: thumbnailUrl,
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: "cant upload" });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};