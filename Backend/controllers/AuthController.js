// controllers/AuthController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/JwtToken.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../middleware/Error.js"; // named import (make sure Error.js exports it)
import jwt from "jsonwebtoken";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, adminKey } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Count total users in DB
    const userCount = await User.countDocuments();

    let role = "user";

    // If first user → make super-admin
    if (userCount === 0) {
      role = "super-admin";
      console.log("🌿 First user registered as super-admin");
    }
    // Or if adminKey matches secret key → super-admin
    else if (adminKey && adminKey === process.env.ADMIN_SECRET) {
      role = "super-admin";
    }

    // Create new user (password auto-hashed in model)
    const user = await User.create({ username, email, password, role });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    user.password = undefined; // hide password from response

    res
      .cookie("token", token, {
        httpOnly: true, // prevents JavaScript access (XSS safe)
        secure: process.env.NODE_ENV === "production", // only https in prod
        sameSite: "None", // important if frontend runs on different port (like 5173)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    // If using cookies, you can clear cookie here:
    // res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    next(new ErrorHandler("Error logging out", 500));
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    next(new ErrorHandler("Server error", 500));
  }
};
