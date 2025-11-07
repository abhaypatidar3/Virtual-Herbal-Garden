// ✅ routes/bookmarkRoutes.js
import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controllers/bookmarkController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Add bookmark
router.post("/", verifyToken, addBookmark);

// Remove bookmark
router.delete("/:plantId", verifyToken, removeBookmark);

// Get all bookmarks
router.get("/", verifyToken, getBookmarks);

export default router;
