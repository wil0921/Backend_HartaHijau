const { Router } = require("express");
const sessionController = require("./session.controller");

const SessionRouter = Router();

SessionRouter.all("/start-session", sessionController.createSession);
SessionRouter.all("/delete-session", sessionController.deleteSession);
SessionRouter.all("/sessions", sessionController.sessions);

module.exports = SessionRouter;
