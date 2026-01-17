import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Initialize Database
const startServer = async () => {
  try {
    await connectDB();

    // Only listen if not in production/serverless environment that handles listening for us
    // Or if we specifically want to run the standalone server
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.STANDALONE === "true"
    ) {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();

// Export for serverless platforms like Vercel
export default app;
