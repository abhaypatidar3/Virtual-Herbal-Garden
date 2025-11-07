// middleware/AuthMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorHandler } from "./Error.js";

/**
 * verifyToken
 * - Looks for token in cookie `token` first, then Authorization header (Bearer).
 * - Verifies JWT and attaches user to req.user (excluding password).
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Try cookie first (requires cookie-parser and frontend to send credentials)
    let token = req.cookies?.token;

    // Fallback: Authorization header "Bearer <token>"
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorHandler("Authentication failed. Please login.", 401));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // jwt.verify throws if invalid or expired
      return next(new ErrorHandler("Invalid or expired token.", 401));
    }

    // Attach user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ErrorHandler("User not found. Please login again.", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    // Any unexpected error forwarded to central error handler
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
