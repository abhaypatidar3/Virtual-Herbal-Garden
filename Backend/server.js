import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import app from "./app.js";
import { errorMiddleware } from "./middleware/Error.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const opts = {
  serverSelectionTimeoutMS: 5000,
  dbName: process.env.MONGO_DB_NAME || "virtual_herbal_garden",
};

// 🌿 Connect MongoDB
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
    next(error); // ✅ Pass errors to errorMiddleware
  }
});

// ✅ Attach error handler (important: must be last)
app.use(errorMiddleware);

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
