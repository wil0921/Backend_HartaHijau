// Import library
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

// Dummy data user
const users = [
  { id: 1, phoneNumber: '08123456789', password: 'password1' },
  { id: 2, phoneNumber: '08987654321', password: 'password2' }
];

// Route login
app.post('/login', (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = users.find(u => u.phoneNumber === phoneNumber);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Nomor telepon atau password salah' });
  }

  const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

  res.json({ token });
});

// Middleware otentikasi jwt
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
}

app.get('/secure', authenticateToken, (req, res) => {
  res.json({ message: 'Akses diizinkan' });
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
