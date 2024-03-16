const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const dbName = 'app_database';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Terhubung ke database MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Koneksi ke database gagal:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };