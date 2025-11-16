// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import externalPlantRoutes from "./routes/externalPlantRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ NEW
import { errorMiddleware } from "./middleware/Error.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve uploaded files (e.g. profile images) from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/external-plants", externalPlantRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminRoutes); // ✅ NEW - Admin panel routes

// Health check
app.get("/", (req, res) => {
  res.send("Server is live!");
});

// Centralized error middleware (must be last)
app.use(errorMiddleware);

export default app;