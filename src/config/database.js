const mysql2 = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
