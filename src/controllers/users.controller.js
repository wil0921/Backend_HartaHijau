const connectToDatabase = require("../config/database");
const bcrypt = require("bcrypt");

const createNewUser = async (req, res) => {
  const { phoneNumber, username, password } = req.body;

  // hashing password
  const saltRounds = 10;
  const hashedPassword = bcrypt.hash(password, saltRounds);

  try {
    const pool = await connectToDatabase();
    const query =
      "INSERT INTO users (phoneNumber, username, password, verified) VALUES (?, ?, ?, ?)";
    const values = [phoneNumber, username, hashedPassword, false];
    const [result] = await pool.query(query, values);

    return res.status(201).json({
      status: true,
      message: "Berhasil menambahkan user",
      result,
    });
  } catch (err) {
    console.error("Error saat menambahkan user:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menambah user",
      error: err.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const [users] = await pool.query("SELECT * FROM users");

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil user",
      users,
    });
  } catch (err) {
    console.error("Error saat mengambil user:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengambil user",
      error: err.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.query.id;

  try {
    const pool = await connectToDatabase();
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    console.log(deletedUser);

    return result.affectedRows
      ? res.status(200).json({
          status: true,
          message: `Pengguna dengan ID ${id} berhasil dihapus`,
        })
      : res.status(404).json({
          status: false,
          message: `Pengguna dengan ID ${id} berhasil dihapus`,
        });
  } catch (err) {
    console.error("Error saat menghapus user:", err);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menghapus user",
      error: err.message,
    });
  }
};

module.exports = { addUser, getAllUser, deleteUserById };
