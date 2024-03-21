const addUser = async (req, res) => {
  const { phone, username, password } = req.body;
  const db = await connectToDatabase();
  const collection = db.collection("Harta_Hijau_Data");
  const newUser = { phone, username, password };

  try {
    const result = await collection.insertOne(newUser);
    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan user",
      result: result.ops[0],
    });
  } catch (error) {
    console.error("Error saat menambahkan user:", error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menambah user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Harta_Hijau_Data");

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
  const collection = db.collection("Harta_Hijau_Data");
  const id = req.params.id;

  try {
    const result = await collection.deleteOne({ _id: id });
    res.status(200).json({
      status: true,
      message: `User dengan ID ${id} berhasil dihapus`,
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
