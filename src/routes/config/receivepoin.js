const { addPointsToUser } = require('./code.js');
const { recordTransaction } = require('./sendpoin.js');

function receivePoints(receiverId, senderId, points) {
  addPointsToUser(receiverId, points);
  
  recordTransaction(senderId, receiverId, points);
}

const senderId = 1;
const receiverId = 2;
const points = 100;
receivePoints(receiverId, senderId, points);
