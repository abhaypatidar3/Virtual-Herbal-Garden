// controllers/UserController.js
import User from "../models/User.js";
import { ErrorHandler } from "../middleware/Error.js";

// Get current logged-in user's info
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("bookmarks");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    next(new ErrorHandler("Server error", 500));
  }
};

// Update user profile (username, email)
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return next(new ErrorHandler("Email already in use", 400));
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return next(new ErrorHandler("Username already in use", 400));
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    next(new ErrorHandler(err.message || "Server error", 500));
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return next(new ErrorHandler("Please provide both current and new password", 400));
    }

    if (newPassword.length < 8) {
      return next(new ErrorHandler("New password must be at least 8 characters", 400));
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Error in changePassword:", err);
    next(new ErrorHandler(err.message || "Server error", 500));
  }
};

// Delete account
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return next(new ErrorHandler("Please provide your password to delete account", 400));
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect password", 400));
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteAccount:", err);
    next(new ErrorHandler(err.message || "Server error", 500));
  }
};

// Get user stats (bookmarks, quiz scores)
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("bookmarks");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const stats = {
      totalBookmarks: user.bookmarks.length,
      accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      memberSince: user.createdAt,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Error in getUserStats:", err);
    next(new ErrorHandler(err.message || "Server error", 500));
  }
};