
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../sequelize/sequelize');

const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true // Ensure the thumbnail is a valid URL
    }
  }
});

module.exports = News;