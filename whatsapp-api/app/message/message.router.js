const { Router } = require("express");
const messageController = require("./message.controller");
const MessageRouter = Router();

MessageRouter.all("/send-message", messageController.sendMessage);

module.exports = MessageRouter;
