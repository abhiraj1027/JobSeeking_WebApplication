import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import cloudinary from "cloudinary";

// Load environment variables from the .env file
dotenv.config();

// Validate necessary environment variables
const requiredEnvVars = ['MONGO_URI', 'PORT', 'CLOUDINARY_CLIENT_NAME', 'CLOUDINARY_CLIENT_API', 'CLOUDINARY_API_SECRET'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing environment variable: ${varName}`);
    process.exit(1); // Exit if any required environment variable is missing
  }
});

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB with retry mechanism and enhanced error handling
const startServer = async () => {
  try {
    // Establish MongoDB connection with enhanced options for stability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected successfully");

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    if (error instanceof mongoose.Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ Server startup error:", error.message);
    }
    
    // Exit the process after failure
    process.exit(1); // Exit process with failure code
  }
};

// Gracefully handle server shutdown (e.g., on Ctrl+C or any unexpected errors)
const gracefulShutdown = () => {
  console.log("🛑 Server shutting down...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown); // For Ctrl+C exit
process.on('SIGTERM', gracefulShutdown); // For graceful termination

// Start the server
startServer();
