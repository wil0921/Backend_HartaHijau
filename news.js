const express = require('express');
const app = express();
const port = 88;

const newsRoutes = require('./routes/news.route');

app.use(newsRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
