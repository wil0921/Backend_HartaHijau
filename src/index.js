const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Selamat datang di server Node.js!');
});


app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
