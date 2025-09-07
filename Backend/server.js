import express from "express";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ JWT check middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

// ✅ Public route (no login needed)
app.get("/api/auth/public", (req, res) => {
  res.json({ message: "Public route - no login required" });
});

// ✅ Protected route (login needed)
app.get("/api/auth/protected", checkJwt, (req, res) => {
  res.json({ message: "Protected route - secured resource", user: req.auth });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
