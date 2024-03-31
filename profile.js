const { db } = require('./profileconfig');

const changeProfilePicture = (req, res) => {
  const userId = req.body.user_id;
  const newPicture = req.file;

  const sql = `UPDATE users SET profile_picture = ? WHERE id = ?`;
  db.query(sql, [newPicture.filename, userId], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Profile picture updated successfully' });
  });
};

//logout
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};


//ini untuk menentukan jumlah poin yang udah di terima dan di kirim oleh user selama akun user dibuat
//tapi ini belum bener sih kayaknya
const withdrawPoints = (req, res) => {
  const userId = req.body.user_id;
  const amount = req.body.amount;

  res.json({ message: 'Points withdrawn successfully' });
};

const earnPoints = (req, res) => {
  const userId = req.body.user_id;
  const amount = req.body.amount;

  res.json({ message: 'Points earned successfully' });
};

module.exports = { changeProfilePicture, logout, withdrawPoints, earnPoints };


//tak taruh disini karna gatau harus masuk ke folder mana