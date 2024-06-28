const { Product } = require("../../sequelize/db/models");

const createNewProduct = (productthumbnailUrl, price, productName) => {
  return Product.create({
    productName,
    price,
    productthumbnailUrl,
  });
};

const getAllProduct = () => Product.findAll();

const getProductById = (id) => Product.findOne({ where: { id } });

const updateProductById = (id, fields) => Product.update({ fields }, { where: { id } });

const deleteProductById = (id) => Product.destroy({ where: { id } });

module.exports = {
  createNewProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
