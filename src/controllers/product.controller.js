const productModel = require("../models/product.model");
const uploadImageToCloudinary = require("../utils/cloudinary");
const { CustomError } = require("../utils");

const createNewProduct = async (req, res, next) => {
  try {
    const { productName, price, productthumbnailUrl } = req.body;
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      productPict = result.secure_url;
    }

    await productModel.createNewProduct(productName, price, productthumbnailUrl);

    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan berita",
    });
  } catch (err) {
    console.error("Error saat menambahkan berita:", err);
    next(err);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const product = await productModelModel.getAllProduct();

    if (!product.length) {
      return res.status(404).json({
        status: false,
        message: "tidak ada produk untuk ditampilkan",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil semua produk",
      product,
    });
  } catch (err) {
    console.error("Error saat mengambil semua produk:", err);
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(401).json({
        status: false,
        message: "harap masukkan id produk",
      });
    }

    const product = await productModel.getProductById(id);

    if (!product.length) {
      return res.status(404).json({
        status: false,
        message: "tidak ada produk untuk ditampilkan",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil produk",
      product,
    });
  } catch (err) {
    console.error("Error saat mengambil produk berdasarkan id:", err);
    next(err);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { productName, price } = req.body;
    let fields = { productName, price };

    if (!id) {
      return res.status(401).json({
        status: false,
        message: "harap masukkan id produk",
      });
    }

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      const productthumbnailUrl = result.secure_url;
      fields = { productName, price, productthumbnailUrl };
    }

    const updatedProduct = await productModel.updateProductById(id, fields);

    return res.status(200).json({
      status: true,
      message: "Berhasil memperbarui produk",
      updatedProduct,
    });
  } catch (err) {
    console.error("Error saat memperbarui produk berdasarkan id:", err);
    next(err);
  }
};

const deleteProductById = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    throw new CustomError.ClientError(
      "Harap cantumkan id pengguna"
    ).setStatusCode(401);
  }

  try {
    const result = await productModel.getProductById(id);

    if (!result) {
      throw new CustomError.ClientError(
        `Gagal menghapus, produk dengan ID ${id} tidak ditemukan.`
      ).setStatusCode(404);
    }

    await productModel.deleteProductById(id);

    return res.status(200).json({
      status: true,
      message: `Produk dengan ID ${id} berhasil dihapus`,
    });
  } catch (err) {
    console.error("Error saat menghapus produk:", err);
    next(err);
  }
};

module.exports = {
  createNewProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
