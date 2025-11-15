// src/routes/authRoutes.js
import express from "express";

import {
  getMe,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/AuthController.js";

import { verifyToken, authorizeRoles } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout -> use POST so frontend can call POST /api/auth/logout
router.post("/logout", logoutUser);

// GET /api/auth/me
router.get("/me", verifyToken, getMe);

// Protected test route (example)
router.get(
  "/protected",
  verifyToken,
  authorizeRoles("super-admin"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role}, you're authorized.` });
  }
);

export default router;
