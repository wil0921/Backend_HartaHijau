const express = require('express');
const productRoute = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload');

productRoute.post('/', upload.single('thumbnail'), productController.createNewProduct);
productRoute.get('/', productController.getAllProduct);

module.exports = productRoute;