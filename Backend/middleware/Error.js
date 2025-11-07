// // middleware/Error.js

// class ErrorHandler extends Error {
//   constructor(message, statusCode = 500) {
//     super(message);
//     this.statusCode = statusCode;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// const errorMiddleware = (err, req, res, next) => {
//   let customError = err;

//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error";

//   // Handle specific known errors
//   if (err.name === "CastError") {
//     customError = new ErrorHandler(`Invalid ${err.path}`, 400);
//   } else if (err.code === 11000) {
//     const field = Object.keys(err.keyValue || {}).join(", ");
//     customError = new ErrorHandler(`Duplicate field value: ${field}`, 400);
//   } else if (err.name === "JsonWebTokenError") {
//     customError = new ErrorHandler(
//       "JSON Web Token is invalid. Try again.",
//       401
//     );
//   } else if (err.name === "TokenExpiredError" || err.name === "TokenExpired") {
//     customError = new ErrorHandler(
//       "JSON Web Token has expired. Please login again.",
//       401
//     );
//   } else if (!(err instanceof ErrorHandler)) {
//     customError = new ErrorHandler(message, statusCode);
//   }

//   const responsePayload = {
//     success: false,
//     message: customError.message,
//   };

//   if (process.env.NODE_ENV === "development") {
//     responsePayload.stack = err.stack;
//   }

//   return res.status(customError.statusCode || 500).json(responsePayload);
// };

// // ✅ Export both together as named exports (no default)
// export { ErrorHandler, errorMiddleware };
// middleware/Error.js
class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  let customError = err;

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (err.name === "CastError") {
    customError = new ErrorHandler(`Invalid ${err.path}`, 400);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    customError = new ErrorHandler(`Duplicate field value: ${field}`, 400);
  } else if (err.name === "JsonWebTokenError") {
    customError = new ErrorHandler("Invalid token. Please login again.", 401);
  } else if (err.name === "TokenExpiredError") {
    customError = new ErrorHandler("Token expired. Please login again.", 401);
  } else if (!(err instanceof ErrorHandler)) {
    customError = new ErrorHandler(message, statusCode);
  }

  const response = {
    success: false,
    message: customError.message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(customError.statusCode || 500).json(response);
};

export { ErrorHandler, errorMiddleware };
