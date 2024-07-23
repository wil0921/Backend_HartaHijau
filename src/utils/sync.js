const sequelize = require('./sequelize/sequelize');
const News = require('./src/models/news.model');
const Product = require('./src/models/product.model');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();