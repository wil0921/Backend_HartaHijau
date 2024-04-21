const whatsapp = require("wa-multi-session");

const sendMessage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let isGroup = req.body.isGroup || req.query.isGroup;
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    // AUTHENTICATION
    if (!to) throw new Error("Harap cantumkan nomor tujuan");
    if (!text) throw new Error("Harap cantumkan pesan yang akan dikirim");
    if (!sessionId) throw new Error("Sesi tidak ditemukan");

    // SENDING WHATSAPP MESSAGE
    const receiver = to;
    const send = await whatsapp.sendTextMessage({
      sessionId,
      to: receiver,
      isGroup: !!isGroup,
      text,
    });

    res.status(200).json({
      id: send?.key?.id,
      status: send?.status,
      message: send?.message?.extendedTextMessage?.text || "Not Text",
      remoteJid: send?.key?.remoteJid,
    });
  } catch (error) {
    next(error);
  }
};

const messageController = { sendMessage };
module.exports = messageController