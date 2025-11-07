// middleware/Error.js

export class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  // ensure we have an Error object shape
  let customError = err;

  // Defaults
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Handle specific known errors
  if (err.name === "CastError") {
    customError = new ErrorHandler(`Invalid ${err.path}`, 400);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    customError = new ErrorHandler(`Duplicate field value: ${field}`, 400);
  } else if (err.name === "JsonWebTokenError") {
    customError = new ErrorHandler("JSON Web Token is invalid. Try again.", 401);
  } else if (err.name === "TokenExpiredError" || err.name === "TokenExpired") {
    customError = new ErrorHandler("JSON Web Token has expired. Please login again.", 401);
  } else {
    customError = new ErrorHandler(message, statusCode);
  }

  const responsePayload = {
    success: false,
    message: customError.message,
  };

  // Include stack in development only
  if (process.env.NODE_ENV === "development") {
    responsePayload.stack = err.stack;
  }

  return res.status(customError.statusCode || 500).json(responsePayload);
};

export default errorMiddleware;
