const whatsapp = require("wa-multi-session");

const createSession = async (req, res, next) => {
  try {
    const scan = req.query.scan;
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    // IF SESSION NAME PARAMETER DOESN'T EXIST
    if (!sessionName) {
      throw new Error("Harap cantumkan nama sesi");
    }

    // IF QR CODE UPDATED
    whatsapp.onQRUpdated(async (data) => {
      // 1). ENSURE RESPONSE NOT SENDED YET
      if (res && !res.headersSent) {
        // 2). GENERATE NEW QR CODE
        const qr = await toDataURL(data.qr);
        // 3). ENSURE THAT CLIENT ON SCAN MODE AND SESSION NAME IS CORRECT
        if (scan && data.sessionId == sessionName) {
          // 4). SEND QR CODE AS RESPONSE
          res.render("Scan ini untuk terhubung whatsapp: ", { qr: qr });
        } else {
          // 3). RESPONSE IF NOT IN SCAN MODE
          res.status(200).json({ qr });
        }
      }

      // START WHATSAPP SESSION
      await whatsapp.startSession(sessionName, { printQR: true });
    });
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    // IF SESSION NAME PARAMETER DOESN'T EXIST
    if (!sessionName) {
      throw new Error("Harap cantumkan nama sesi");
    }

    // DELETE WHATSAPP SESSION
    whatsapp.deleteSession(sessionName);

    res.status(200).json({ message: `Berhasil menghapus sesi ${sessionName}` });
  } catch (error) {
    next(error);
  }
};

const sessions = async (req, res, next) => {
  try {
    const key = req.body.key || req.query.key || req.headers.key;

    // IS KEY PROVIDED AND SECURED
    if (process.env.KEY && process.env.KEY != key) {
      throw new ValidationError("Kunci tidak valid");
    }

    res.status(200).json({ message: whatsapp.getAllSession() });
  } catch (error) {
    next(error);
  }
};

const sessionController = { createSession, deleteSession, sessions };

module.exports = sessionController;
