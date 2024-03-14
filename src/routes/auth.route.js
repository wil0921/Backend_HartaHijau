// Import controller
import authController from "../controllers/auth.controller";
// Import middleware
import authMiddleware from "../middleware/auth.middleware";

// Dummy data user
const users = [
  { id: 1, phoneNumber: "08123456789", password: "password1" },
  { id: 2, phoneNumber: "08987654321", password: "password2" },
];

// Route register
app.post("/register", authController.register);

// Route verify user
app.post("/verify", authController.verifyAuth);

// Route login
app.post("/login", authController.login);

// Route secure user
app.get("/secure", authMiddleware.authenticateToken, authController.secureAuth);
