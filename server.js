const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const routes = require("./src/routes");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Selamat datang di server Node.js!");
});

app.get("/users", async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DATABASE_NAME);
    const users = await db
      .collection(process.env.COLLECTION_NAME)
      .find()
      .toArray();
    res.json(users);
    client.close();
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam mengambil data pengguna" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DATABASE_NAME);
    const result = await db
      .collection(process.env.COLLECTION_NAME)
      .insertOne({ username, email });
    res
      .status(201)
      .json({ message: "Data pengguna disimpan!", data: result.ops[0] });
    client.close();
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam menyimpan data pengguna" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DATABASE_NAME);
    const user = await db
      .collection(process.env.COLLECTION_NAME)
      .findOne({ _id: ObjectId(userId) });
    res.status(200).json(user);
    client.close();
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam mengambil data pengguna" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DATABASE_NAME);
    const result = await db
      .collection(process.env.COLLECTION_NAME)
      .deleteOne({ _id: ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Data pengguna tidak ditemukan" });
    }
    res
      .status(200)
      .json({ message: `Data pengguna dengan ID ${userId} berhasil dihapus!` });
    client.close();
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam menghapus data pengguna" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DATABASE_NAME);
    const result = await db
      .collection(process.env.COLLECTION_NAME)
      .updateOne({ _id: ObjectId(userId) }, { $set: { username, email } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Data pengguna tidak ditemukan" });
    }
    res.status(200).json({
      message: `Data pengguna dengan ID ${userId} berhasil diupdate!`,
    });
    client.close();
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam mengupdate data pengguna" });
  }
});

app.listen(PORT, () => {
  console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});
