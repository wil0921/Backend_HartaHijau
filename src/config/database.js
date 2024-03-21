const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Terhubung ke database MongoDB");
    return client.db(process.env.dbName);
  } catch (error) {
    console.error("Koneksi ke database gagal:", error);
    throw error;
  }
};

module.exports = connectToDatabase;
