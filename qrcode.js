const qr = require("qrcode");
const connectToDatabase = require("./src/config/database");

const createQRCode = async () => {
  try {
    const db = await connectToDatabase();

    // Mengambil data dari MongoDB
    const users = await db.collection("Users").find().toArray();
    console.log("users:", users); // Output users untuk pengecekan

    users.forEach(async (user) => {
      let stJson = JSON.stringify(user);
      console.log("string user:", stJson); // Output string user untuk pengecekan

      // Membuat kode QR
      const QRCode = await qr.toFile(`qr_${user.username}.png`, stJson);
      console.log(
        `Kode QR telah dibuat untuk pengguna dengan nama ${user.username} dan ID ${user._id}`
      );
      console.log(QRCode);
    });
  } catch (err) {
    console.error("Error:", err);
    return;
  }
};

createQRCode();
