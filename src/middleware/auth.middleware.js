// Import library
const jwt = require('jsonwebtoken');

// Jwt auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }
    req.user = user;
    next();
  });
};

//menggabungkan semua auth middleware kedalam 1 variabel agar mudah dikelola
const authMiddleware = { authenticateToken };
module.exports = authMiddleware;
