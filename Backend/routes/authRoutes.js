import express from "express";
import { checkJwt } from "../middlewares/auth0Middleware.js";

const router = express.Router();

// ✅ Public route (no login required)
router.get("/public", (req, res) => {
  res.json({ message: "✅ Public route, no login required" });
});

// 🔒 Protected route (login required)
router.get("/protected", checkJwt, (req, res) => {
  res.json({
    message: "🔒 Protected route, only with Auth0 token",
    user: req.auth, // user info decoded from token
  });
});

export default router;
