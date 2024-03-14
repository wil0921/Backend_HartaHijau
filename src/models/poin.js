const fs = require('fs');

function readUsersData() {
  try {
    const usersData = fs.readFileSync('users.json', 'utf8');
    return JSON.parse(usersData);
  } catch (err) {
    return [];
  }
}

function writeUsersData(usersData) {
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2), 'utf8');
}

function addPointsToUser(userId, points) {
  const usersData = readUsersData();
  const userIndex = usersData.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    usersData[userIndex].points += points;
    writeUsersData(usersData);
    return true;
  }
  return false;
}

function getUserPoints(userId) {
  const usersData = readUsersData();
  const user = usersData.find(user => user.id === userId);
  return user ? user.points : null;
}

module.exports = { addPointsToUser, getUserPoints };
