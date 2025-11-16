// controllers/AdminController.js
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import { ErrorHandler } from "../middleware/Error.js";
import mongoose from "mongoose";

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ========================================
// DASHBOARD STATS
// ========================================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "super-admin" });
    const totalPlants = await Plant.countDocuments();
    
    // Get users with bookmarks count - FIXED VERSION
    const usersWithBookmarks = await User.aggregate([
      {
        $project: {
          bookmarkCount: {
            $cond: {
              if: { $isArray: "$bookmarks" },
              then: { $size: "$bookmarks" },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$bookmarkCount" }
        }
      }
    ]);
    const totalBookmarks = usersWithBookmarks[0]?.total || 0;

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Most bookmarked plants - FIXED VERSION with ObjectId validation
    const bookmarkStats = await User.aggregate([
      { $match: { bookmarks: { $exists: true, $ne: [] } } },
      { $unwind: "$bookmarks" },
      { 
        $addFields: {
          isValidObjectId: {
            $and: [
              { $ne: ["$bookmarks", null] },
              { $eq: [{ $type: "$bookmarks" }, "objectId"] }
            ]
          }
        }
      },
      { $match: { isValidObjectId: true } },
      { $group: { _id: "$bookmarks", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get plant names for top bookmarked
    const topBookmarkedPlants = await Promise.all(
      bookmarkStats.map(async (stat) => {
        try {
          // Additional validation before querying
          if (!isValidObjectId(stat._id)) {
            console.warn(`Invalid plant ID in bookmarks: ${stat._id}`);
            return {
              plantId: stat._id,
              plantName: "Invalid Plant ID",
              bookmarkCount: stat.count
            };
          }
          
          const plant = await Plant.findById(stat._id);
          return {
            plantId: stat._id,
            plantName: plant?.name || "Unknown Plant",
            bookmarkCount: stat.count
          };
        } catch (error) {
          console.error(`Error fetching plant ${stat._id}:`, error);
          return {
            plantId: stat._id,
            plantName: "Error Loading Plant",
            bookmarkCount: stat.count
          };
        }
      })
    );

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalPlants,
        totalBookmarks,
        recentUsers,
        topBookmarkedPlants,
        userGrowth
      }
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// USER MANAGEMENT
// ========================================

// Get all users with pagination and filters
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const sortBy = req.query.sortBy || "-createdAt";

    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort(sortBy)
      .limit(limit)
      .skip((page - 1) * limit);

    // Add bookmark count to each user - FIXED VERSION
    const usersWithStats = users.map((user) => {
      return {
        ...user.toObject(),
        bookmarkCount: Array.isArray(user.bookmarks) ? user.bookmarks.length : 0
      };
    });

    res.status(200).json({
      success: true,
      users: usersWithStats,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Get single user details
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "bookmarks",
        match: { _id: { $type: "objectId" } } // Only populate valid ObjectIds
      });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const accountAge = Math.floor(
      (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)
    );

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        accountAge,
        bookmarkCount: Array.isArray(user.bookmarks) ? user.bookmarks.length : 0
      }
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Update user (admin edit)
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, email, role } = req.body;

    // Prevent admin from demoting themselves
    if (userId === req.user._id.toString() && role !== "super-admin") {
      return next(new ErrorHandler("You cannot change your own role", 400));
    }

    // Check for duplicate username or email
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });
      if (existingUser) {
        return next(new ErrorHandler("Username already taken", 400));
      }
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId }
      });
      if (existingUser) {
        return next(new ErrorHandler("Email already taken", 400));
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Delete user (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return next(new ErrorHandler("You cannot delete your own account", 400));
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// ANALYTICS
// ========================================

// Get detailed analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const { period = "30" } = req.query; // days
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // User registrations over time
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Most active users (by bookmark count) - FIXED VERSION
    const mostActiveUsers = await User.aggregate([
      {
        $project: {
          username: 1,
          email: 1,
          bookmarkCount: {
            $cond: {
              if: { $isArray: "$bookmarks" },
              then: { $size: "$bookmarks" },
              else: 0
            }
          }
        }
      },
      { $sort: { bookmarkCount: -1 } },
      { $limit: 10 }
    ]);

    // Plant bookmark trends - FIXED VERSION with ObjectId validation
    const plantBookmarkTrends = await User.aggregate([
      { $match: { bookmarks: { $exists: true, $ne: [] } } },
      { $unwind: "$bookmarks" },
      { 
        $addFields: {
          isValidObjectId: {
            $and: [
              { $ne: ["$bookmarks", null] },
              { $eq: [{ $type: "$bookmarks" }, "objectId"] }
            ]
          }
        }
      },
      { $match: { isValidObjectId: true } },
      { $group: { _id: "$bookmarks", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const plantsWithNames = await Promise.all(
      plantBookmarkTrends.map(async (item) => {
        try {
          if (!isValidObjectId(item._id)) {
            console.warn(`Invalid plant ID in analytics: ${item._id}`);
            return {
              plantId: item._id,
              plantName: "Invalid Plant ID",
              bookmarkCount: item.count
            };
          }
          
          const plant = await Plant.findById(item._id);
          return {
            plantId: item._id,
            plantName: plant?.name || "Unknown Plant",
            bookmarkCount: item.count
          };
        } catch (error) {
          console.error(`Error fetching plant ${item._id}:`, error);
          return {
            plantId: item._id,
            plantName: "Error Loading Plant",
            bookmarkCount: item.count
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      analytics: {
        userRegistrations,
        roleDistribution,
        mostActiveUsers,
        plantBookmarkTrends: plantsWithNames
      }
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// Get system logs (simplified version)
export const getSystemLogs = async (req, res, next) => {
  try {
    const recentUsers = await User.find()
      .sort("-createdAt")
      .limit(20)
      .select("username email createdAt role");

    const logs = recentUsers.map(user => ({
      action: "User Registration",
      user: user.username,
      email: user.email,
      role: user.role,
      timestamp: user.createdAt
    }));

    res.status(200).json({
      success: true,
      logs
    });
  } catch (error) {
    console.error("Error in getSystemLogs:", error);
    next(new ErrorHandler(error.message, 500));
  }
};