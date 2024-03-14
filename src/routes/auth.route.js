// Import controller
import authController from "../controllers/auth.controller";
// Import middleware
import authMiddleware from "../middleware/auth.middleware";

// Route register
app.post("/register", authController.register);

// Route verify user
app.post("/verify", authController.verifyAuth);

// Route login
app.post("/login", authController.login);

// Route secure user
app.get("/secure", authMiddleware.authenticateToken, authController.secureAuth);
