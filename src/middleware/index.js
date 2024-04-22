const authMiddleware = require("./auth.middleware");
const serverMiddleware = require("./server.middleware");
const errorMiddleware = require("./error.middleware");

module.exports = { authMiddleware, serverMiddleware, errorMiddleware };
