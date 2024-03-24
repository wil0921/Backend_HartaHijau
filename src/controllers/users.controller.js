const connectToDatabase = require("../config/database");

const addUser = async (req, res) => {
  const { phone, username, password } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("Users");
  const newUser = { phone, username, password };

  try {
    await collection.insertOne(newUser);
    return res.status(201).json({
      status: true,
      message: "Berhasil menambahkan user",
    });
  } catch (error) {
    console.error("Error saat menambahkan user:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menambah user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Users");

  try {
    const users = await collection.find().toArray();
    res.status(200).json({
      status: true,
      message: "Berhasil mengambil user",
      users,
    });
  } catch (error) {
    console.error("Error saat mengambil user:", error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengambil user",
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Users");
  const id = req.query.id;
  const { ObjectId } = require("mongodb");

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount
      ? res.status(200).json({
          status: true,
          message: `User dengan ID ${id} berhasil dihapus`,
        })
      : res.status(400).json({
          status: false,
          message: `User dengan ID ${id} tidak ditemukan`,
        });
  } catch (error) {
    console.error("Error saat menghapus user:", error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menghapus user",
      error: error.message,
    });
  }
};

module.exports = { addUser, getAllUser, deleteUserById };
