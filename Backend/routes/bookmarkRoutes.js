// routes/bookmarkRoutes.js
import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controllers/bookmarkController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All bookmark routes require authentication
router.use(verifyToken);

// GET /api/bookmarks - Get all bookmarks for logged-in user
router.get("/", getBookmarks);

// POST /api/bookmarks - Add a plant to bookmarks
router.post("/", addBookmark);

// DELETE /api/bookmarks/:plantId - Remove a plant from bookmarks
router.delete("/:plantId", removeBookmark);

export default router;