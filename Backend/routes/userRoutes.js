// src/routes/userRoutes.js
import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMe } from "../controllers/UserController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);   // <-- simple JSON route
router.get("/me", verifyToken, getMe);

export default router;
