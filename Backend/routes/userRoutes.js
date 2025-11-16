// src/routes/userRoutes.js
import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { 
  getMe, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  getUserStats 
} from "../controllers/UserController.js";

const router = express.Router();

// ========================================
// AUTH ROUTES (Public)
// ========================================
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);

// ========================================
// USER ROUTES (Protected - require authentication)
// ========================================

// Get current user info
router.get("/me", verifyToken, getMe);

// Update profile (username, email)
router.put("/profile", verifyToken, updateProfile);

// Change password
router.put("/password", verifyToken, changePassword);

// Delete account
router.delete("/account", verifyToken, deleteAccount);

// Get user statistics
router.get("/stats", verifyToken, getUserStats);

export default router;