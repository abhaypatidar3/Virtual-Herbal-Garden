// controllers/AuthController.js
import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import { sendToken } from "../utils/JwtToken.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../middleware/Error.js"; // named import (make sure Error.js exports it)
import jwt from "jsonwebtoken";
import path from "path";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    console.log("---- registerUser called ----");
    console.log("req.headers['content-type']:", req.headers["content-type"]);
    console.log("req.is multipart?:", req.is("multipart/form-data"));
    console.log("req.file:", req.file);       // multer file info (if any)
    console.log("req.body:", req.body);       // should be populated by multer

    const { username, email, password, adminKey } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Count total users in DB
    const userCount = await User.countDocuments();

    let role = "user";

    // If first user → super-admin
    if (userCount === 0) {
      role = "super-admin";
      console.log("🌿 First user registered as super-admin");
    } else if (adminKey && adminKey === process.env.ADMIN_SECRET) {
      role = "super-admin";
    }

    // ⭐ HANDLE PROFILE PHOTO
    let profilePic = "";
    if (req.file) {
      profilePic = `/uploads/profile/${req.file.filename}`;
      console.log("📸 Uploaded profile:", profilePic);
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      profilePic,
    });

    // Generate token
    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    console.error("Register error (full):", error);    // <--- full stack trace
    // in dev return error message to client to inspect in Network tab (remove in prod)
    return res.status(500).json({ success: false, message: error.message, stack: error.stack });
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
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,           // ❗ always false in localhost
        sameSite: "lax",         // ❗ allows cookie over HTTP + cross routes
        path:"/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

export const logoutUser = (req, res) => {
  // Clear cookie (dev-friendly: secure=false, sameSite='lax')
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
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
