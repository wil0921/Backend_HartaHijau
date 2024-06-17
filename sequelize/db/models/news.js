"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }  
  News.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true, // Ensure the thumbnail is a valid URL
        },
      },
    },
    {
      sequelize,
      modelName: "News",
      tableName: "News",
    }
  );

  return News;
};