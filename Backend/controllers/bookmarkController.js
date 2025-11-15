// controllers/bookmarkController.js
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import { ErrorHandler } from "../middleware/Error.js";

// 🌿 Add plant to bookmarks
export const addBookmark = async (req, res, next) => {
  try {
    console.log("📌 addBookmark called");
    console.log("User ID:", req.user?._id);
    console.log("Request body:", req.body);

    const userId = req.user._id;
    const { plantId } = req.body;

    if (!plantId) {
      console.log("❌ No plantId provided");
      return res.status(400).json({ 
        success: false,
        message: "Plant ID is required" 
      });
    }

    console.log("Looking for user with ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("User found:", user.email);
    console.log("Current bookmarks:", user.bookmarks);

    // Avoid duplicates - convert to string for comparison
    const bookmarkExists = user.bookmarks.some(
      (id) => id.toString() === plantId.toString()
    );

    if (bookmarkExists) {
      console.log("⚠️ Already bookmarked");
      return res.status(400).json({ 
        success: false,
        message: "Already bookmarked" 
      });
    }

    user.bookmarks.push(plantId);
    await user.save();

    console.log("✅ Bookmark added successfully");
    console.log("Updated bookmarks:", user.bookmarks);

    res.status(200).json({
      success: true,
      message: "Plant bookmarked successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("❌ Error in addBookmark:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌿 Remove plant from bookmarks
export const removeBookmark = async (req, res, next) => {
  try {
    console.log("🗑️ removeBookmark called");
    const userId = req.user._id;
    const { plantId } = req.params;

    console.log("User ID:", userId);
    console.log("Plant ID to remove:", plantId);

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const beforeCount = user.bookmarks.length;
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== plantId.toString()
    );
    const afterCount = user.bookmarks.length;

    await user.save();

    console.log(`✅ Removed bookmark (before: ${beforeCount}, after: ${afterCount})`);

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("❌ Error in removeBookmark:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌿 Get all bookmarks for a user
export const getBookmarks = async (req, res, next) => {
  try {
    console.log("📖 getBookmarks called");
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Don't populate - just return the IDs
    // Frontend will match these IDs with plants from PlantContext
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("✅ Found bookmark IDs:", user.bookmarks.length);

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarks, // Return array of plant IDs
    });
  } catch (error) {
    console.error("❌ Error in getBookmarks:", error);
    next(new ErrorHandler(error.message, 500));
  }
};