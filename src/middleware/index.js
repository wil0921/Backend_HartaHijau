const authMiddleware = require("./auth.middleware");
const serverMiddleware = require("./server.middleware");
const errorMiddleware = require("./error.middleware");
const newsMiddleware = require("./news.middleware");
const upload = require("./upload");

module.exports = { authMiddleware, serverMiddleware, errorMiddleware, newsMiddleware, upload };
