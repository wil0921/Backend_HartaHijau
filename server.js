const app = require("./api");

// sebaiknya kalo untuk backend pake port selain 3000, karna biasanya port 3000 udah dipake sama frontend
const PORT = process.env.PORT !== undefined ? process.env.PORT : 88;

app.listen(PORT, () => {
  console.log(`SERVER UTAMA BERJALAN PADA http://localhost:${PORT}`);
});

// ftur 
// transaksi(kirim, terima, struk, history), users(adduser), auth(register, login, forgotpassword), produk(getallproduk), userAdmin(updatePoin), news(createNews, getallnews), profile(foto, nama, logout), 
