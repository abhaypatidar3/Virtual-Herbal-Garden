// ✅ controllers/bookmarkController.js
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import { ErrorHandler } from "../middleware/Error.js";

// 🌿 Add plant to bookmarks
export const addBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { plantId } = req.body;

    const plant = await Plant.findById(plantId);
    if (!plant) return next(new ErrorHandler("Plant not found", 404));

    const user = await User.findById(userId);

    // Avoid duplicates
    if (user.bookmarks.includes(plantId)) {
      return res.status(400).json({ message: "Already bookmarked" });
    }

    user.bookmarks.push(plantId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Plant bookmarked successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌿 Remove plant from bookmarks
export const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { plantId } = req.params;

    const user = await User.findById(userId);
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== plantId.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌿 Get all bookmarks for a user
export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("bookmarks");

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};
