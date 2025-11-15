// middleware/AuthMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorHandler } from "../middleware/Error.js";


export const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return next(
        new ErrorHandler("Authentication failed. Please login.", 401)
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Decoded token:", decoded);
    } catch (err) {
      return next(new ErrorHandler("Invalid or expired token.", 401));
    }

    const user = await User.findById(decoded.id).select("-password");
    console.log("🔍 User from DB:", user ? user.email : "NOT FOUND");

    if (!user) {
      return next(new ErrorHandler("User not found. Please login again.", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware unexpected error:", err);
    return next(new ErrorHandler("Authentication error", 500));
  }
};

/**
 * authorizeRoles(...roles)
 * - Usage: authorizeRoles("super-admin", "admin")
 * - Checks req.user.role and returns 403 if role not authorized.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Forbidden: Access denied", 403));
    }
    next();
  };
};
