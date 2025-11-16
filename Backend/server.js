import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { errorMiddleware } from "./middleware/Error.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const opts = {
  serverSelectionTimeoutMS: 5000,
  dbName: process.env.MONGO_DB_NAME || "virtual_herbal_garden",
};

// ========================================
// CREATE UPLOADS DIRECTORY
// ========================================
const uploadsDir = path.join(__dirname, "uploads", "profile");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads/profile directory");
}

// ========================================
// CONNECT TO MONGODB
// ========================================
mongoose
  .connect(process.env.MONGO_URI, opts)
  .then(() => console.log("✅ MongoDB connected:", mongoose.connection.name))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Example external API route
app.get("/api/plants", async (req, res, next) => {
  try {
    const response = await fetch("https://permapeople.org/api/plants?page=2", {
      headers: {
        "x-permapeople-key-id": process.env.PP_KEY_ID,
        "x-permapeople-key-secret": process.env.PP_KEY_SECRET,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ✅ Attach error handler (must be last)
app.use(errorMiddleware);

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mongoose.connection.once("open", async () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
  const users = await mongoose.connection.db
    .collection("users")
    .find()
    .toArray();
  console.log("👥 Found users:", users.length);
  if (users.length > 0) console.log("📋 Example user:", users[0]);
});