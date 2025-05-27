import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";

// Authorization middleware
export const isAuthorized = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  // Check if token exists in cookies
  if (!token) {
    return next(new ErrorHandler("User not authorized", 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user by ID
    const user = await User.findById(decoded.id);

    // If user not found, send an error
    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle JWT errors (expired or invalid token)
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
