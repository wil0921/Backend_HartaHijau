const { News } = require("../../sequelize/db/models");

const createNewNews = (title, description, thumbnailUrl) => {
  return News.create({
    title,
    description,
    thumbnail: thumbnailUrl,
  });
};

const getAllNews = () => News.findAll();

const getNewsById = (id) => News.findOne({ where: { id } });

const updateNewsById = (id, fields) => News.update({ fields }, { where: { id } });

const deleteNewsById = (id) => News.destroy({ where: { id } });

module.exports = {
  createNewNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
};
