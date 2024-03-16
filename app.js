const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./db');

const app = express();
const PORT = 88;

app.use(bodyParser.json());

// Route menambahkan data
app.post('/data', async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection('Harta_Hijau_Data');
  const newData = req.body;

  try {
    const result = await collection.insertOne(newData);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error saat menambahkan data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan data' });
  }
});

// Route mendapatkan semua data
app.get('/data', async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection('Harta_Hijau_Data');

  try {
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Error saat mengambil data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data' });
  }
});

// Route untuk menghapus data berdasarkan ID
app.delete('/data/:id', async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection('Harta_Hijau_Data'); 
  const id = req.params.id;

  try {
    const result = await collection.deleteOne({ _id: id });
    res.json({ message: `Data dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    console.error('Error saat menghapus data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
