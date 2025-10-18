import express from "express";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";
import fetch from "node-fetch"; // add this
import cors from "cors";        // add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow your frontend to call this backend
app.use(cors());

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

// ✅ New route: fetch plants from PermaPeople API
app.get("/api/plants", async (req, res) => {
  try {
    const response = await fetch('https://permapeople.org/api/plants?page=2', {
      headers: {
        'x-permapeople-key-id': process.env.PP_KEY_ID,        // store keys in .env
        'x-permapeople-key-secret': process.env.PP_KEY_SECRET
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
