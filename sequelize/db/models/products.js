'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {}
  }
  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productthumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Product",
    }
  );

  return Product;
};
