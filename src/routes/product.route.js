const express = require("express");
const productRoute = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middleware/upload");

productRoute.post("/", upload.single("productPict"), productController.createNewProduct);

productRoute.get("/", productController.getAllProduct);

productRoute.get("/", productController.getProductById);

productRoute.post("/", productController.updateProductById);

productRoute.delete("/", productController.deleteProductById);

module.exports = productRoute;
