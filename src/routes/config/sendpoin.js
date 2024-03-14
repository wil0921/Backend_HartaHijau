const fs = require('fs');

function readTransactionHistory() {
  try {
    const historyData = fs.readFileSync('transactions.json', 'utf8');
    return JSON.parse(historyData);
  } catch (err) {
    return [];
  }
}

function writeTransactionHistory(historyData) {
  fs.writeFileSync('transactions.json', JSON.stringify(historyData, null, 2), 'utf8');
}

function recordTransaction(senderId, receiverId, points) {
  const historyData = readTransactionHistory();
  const transaction = {
    senderId,
    receiverId,
    points,
    timestamp: new Date().toISOString()
  };
  historyData.push(transaction);
  writeTransactionHistory(historyData);
}

module.exports = { recordTransaction };
