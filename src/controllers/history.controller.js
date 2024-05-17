const historyModel = require("../models/history");

const getHistory = async (req, res, next) => {
  try {
    const history = await historyModel.getAllHistory();
    res.status(200).json({
      status: true,
      data: history,
    });
  } catch (err) {
    console.error("Error fetching transaction history:", err);
    next(err);
  }
};

module.exports = { getHistory };
