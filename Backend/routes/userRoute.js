// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected route example: Get user data
router.get("/", verifyToken, userController.getUserData);

module.exports = router;
