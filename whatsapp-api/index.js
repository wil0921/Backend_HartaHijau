const whatsapp = require("wa-multi-session");
const { Router } = require("express");
const SessionRouter = require("./app/session/session.router");
const MessageRouter = require("./app/message/message.router");

const MainRouter = Router();

MainRouter.get("/", (req, res) => {
  res.status(200).send("Selamat datang di server WHATSAPP API!");
});

MainRouter.use(SessionRouter);
MainRouter.use(MessageRouter);

const init = () => {
  // KETIKA SESI BERHASIL TERKONEKSI
  whatsapp.onConnected((session) => {
    console.log("connected => ", session);
  });

  // KETIKA SESI MENUTUP KONEKSI
  whatsapp.onDisconnected((session) => {
    console.log("disconnected => ", session);
  });

  // KETIKA SESI SEDANG MENGKONEKSI
  whatsapp.onConnecting((session) => {
    console.log("connecting => ", session);
  });

  // MENGAMBIL DATA SESI DARI PENYIMPANAN
  whatsapp.loadSessionsFromStorage();
};

const whatsappApi = { MainRouter, init };

module.exports = whatsappApi;
