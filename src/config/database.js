const mysql2 = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: "localhost",
  user: "root",
  database: "test",
};

const connectToDatabase = async () => {
  try {
    const pool = await mysql2.createPool(dbConfig);
    return pool;
  } catch (error) {
    console.error("Koneksi ke database gagal:", error);
    throw error;
  }
};

module.exports = connectToDatabase;
