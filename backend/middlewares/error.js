class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capturing the stack trace to help with debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Middleware to handle errors
export const errorMiddleware = (err, req, res, next) => {
  console.log(err);  // Log the full error for debugging purposes

  // Set default error message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific errors
  if (err.name === "CastError") {
    // Invalid ID format (e.g., MongoDB ObjectId)
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    // Duplicate key error (e.g., for unique fields like email)
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    // Invalid JWT token
    const message = `JSON Web Token is invalid, please try again!`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    // JWT token expired error
    const message = `JSON Web Token has expired, please log in again!`;
    err = new ErrorHandler(message, 401);  // Return 401 for expired tokens
  }

  // Send the error response to the client
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
