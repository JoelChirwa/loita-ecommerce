import mongoose from "mongoose";

// Cache the database connection for serverless functions
let cachedDb = null;

const connectDB = async () => {
  // If we have a cached connection and it's ready, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("♻️ Using cached MongoDB connection");
    return cachedDb;
  }

  try {
    // Configure mongoose for serverless
    mongoose.set("strictQuery", false);

    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const mongoUrl =
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.DATABASE_URL;

    if (!mongoUrl) {
      throw new Error("MongoDB URL not found in environment variables");
    }

    await mongoose.connect(mongoUrl, opts);
    cachedDb = mongoose.connection;

    console.log("✅ MongoDB connected successfully");
    return cachedDb;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    cachedDb = null;

    // Don't exit in production (Vercel serverless), just throw the error
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
