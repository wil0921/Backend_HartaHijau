const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const app = express();

app.use(bodyParser.json());

// Dummy data user
const users = [];

app.post('/register', (req, res) => {
  const { phoneNumber, username, password } = req.body;

  if (users.some(u => u.phoneNumber === phoneNumber)) {
    return res.status(400).json({ message: 'Nomor telepon sudah terdaftar' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  twilioClient.messages.create({
    body: `Kode OTP Anda: ${otp}`,
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber
  }).then(() => {

    users.push({ phoneNumber, username, password, otp });
    res.json({ message: 'Kode OTP telah dikirimkan ke nomor telepon Anda' });
  }).catch((err) => {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengirimkan OTP' });
  });
});


app.post('/verify', (req, res) => {

  const { phoneNumber, otp } = req.body;

  const user = users.find(u => u.phoneNumber === phoneNumber);

  if (!user || user.otp !== otp) {
    return res.status(401).json({ message: 'Kode OTP tidak valid' });
  }

  const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

  res.json({ token });
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
