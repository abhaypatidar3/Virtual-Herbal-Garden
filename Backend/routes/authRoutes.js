import express from "express";

import {
  getMe,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/AuthController.js";

import { verifyToken, authorizeRoles } from "../middleware/AuthMiddleware.js";

// import upload from "../config/cloudinaryConfig.js";
const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", logoutUser);

// GET /api/auth/me
router.get("/me", verifyToken, getMe);
//logout




// Protected test route
router.get(
  "/protected",
  verifyToken,
  authorizeRoles("super-admin"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role}, you're authorized.` });
  }
);

export default router;
