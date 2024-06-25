const newsModel = require("../models/news.model");
const uploadImageToCloudinary = require("../utils/cloudinary");
const { CustomError } = require("../utils");

const createNewNews = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let thumbnailUrl = null;

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      thumbnailUrl = result.secure_url;
    }

    await newsModel.createNewNews(title, description, thumbnailUrl);

    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan berita",
    });
  } catch (err) {
    console.error("Error saat menambahkan berita:", err);
    next(err);
  }
};

const getAllNews = async (req, res, next) => {
  try {
    const news = await newsModel.getAllNews();

    if (!news.length) {
      return res.status(404).json({
        status: false,
        message: "tidak ada berita untuk ditampilkan",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil semua berita",
      news,
    });
  } catch (err) {
    console.error("Error saat mengambil semua berita:", err);
    next(err);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(401).json({
        status: false,
        message: "harap masukkan id berita",
      });
    }

    const news = await newsModel.getNewsById(id);

    if (!news.length) {
      return res.status(404).json({
        status: false,
        message: "tidak ada berita untuk ditampilkan",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil berita",
      news,
    });
  } catch (err) {
    console.error("Error saat mengambil berita berdasarkan id:", err);
    next(err);
  }
};

const updateNewsById = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { title, description } = req.body;
    let fields = { title, description };

    if (!id) {
      return res.status(401).json({
        status: false,
        message: "harap masukkan id berita",
      });
    }

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      const thumbnailUrl = result.secure_url;
      fields = { title, description, thumbnailUrl };
    }

    const updatedNews = await newsModel.updateNewsById(id, fields);

    return res.status(200).json({
      status: true,
      message: "Berhasil memperbarui berita",
      updatedNews,
    });
  } catch (err) {
    console.error("Error saat memperbarui berita berdasarkan id:", err);
    next(err);
  }
};

const deleteNewsById = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    throw new CustomError.ClientError(
      "Harap cantumkan id pengguna"
    ).setStatusCode(401);
  }

  try {
    const result = await newsModel.getNewsById(id);

    if (!result) {
      throw new CustomError.ClientError(
        `Gagal menghapus, berita dengan ID ${id} tidak ditemukan.`
      ).setStatusCode(404);
    }

    await newsModel.deleteNewsById(id);

    return res.status(200).json({
      status: true,
      message: `Berita dengan ID ${id} berhasil dihapus`,
    });
  } catch (err) {
    console.error("Error saat menghapus berita:", err);
    next(err);
  }
};

module.exports = {
  createNewNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
};
