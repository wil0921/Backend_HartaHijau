const qr = require("qrcode");
const { MongoClient } = require("mongodb");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    id: String
});

const User = mongoose.model("User", userSchema);

// Mengambil data dari MongoDB dan membuat kode QR
User.find({}, (err, users) => {
    if (err) {
        console.error("Error:", err);
        return;
    }

    users.forEach(user => {
        let stJson = JSON.stringify(user);

        // Membuat kode QR
        qr.toFile(`qr_${user.name}.png`, stJson, function(err, code) {
            if (err) console.error("Error:", err);
            else console.log(`Kode QR telah dibuat untuk pengguna dengan nama ${user.name} dan ID ${user.id}`);
        });
    });
});
