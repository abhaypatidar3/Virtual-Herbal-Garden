// controllers/AuthController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/JwtToken.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../middleware/Error.js"; // named import (make sure Error.js exports it)

dotenv.config();

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const profilePic = req.file?.path; // multer

    if (!username || !email || !password) {
      return next(new ErrorHandler("username, email and password are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Hash password and save hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic || undefined,
      role: "user",
    };

    const user = await User.create(userData);

    // sendToken presumed to set cookie and/or return token
    sendToken(user, 201, res, "User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    next(new ErrorHandler("Server Error", 500));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and Password are required.", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }

    let isPasswordMatched = false;
    if (typeof user.comparePassword === "function") {
      isPasswordMatched = await user.comparePassword(password);
    } else {
      isPasswordMatched = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }

    sendToken(user, 200, res, "User logged in successfully.");
  } catch (err) {
    console.error("Login error:", err);
    next(new ErrorHandler("Server Error", 500));
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
