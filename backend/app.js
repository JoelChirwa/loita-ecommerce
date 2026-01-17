import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB from "./config/db.js";

const app = express();

// 1. Basic Middleware (Must come first)
const allowedOrigin = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/$/, "");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        allowedOrigin,
        "http://localhost:5173",
        "http://localhost:5174",
        "https://loita-avon-shop.vercel.app",
        "https://loita-avon.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health check / Root route (placed BEFORE DB middleware for reliability)
app.get("/", (req, res) => {
  res.json({ message: "Loita Avon Shop API is running..." });
});

// Diagnostic route (No DB required)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "System is healthy",
    timestamp: new Date(),
  });
});

// 3. Database Middleware (Ensure connection on every request for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }
});

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// 5. 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 6. Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.url}:`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    path: req.url,
    // Return error name and path to help debug production 500s
    errorType: err.name,
    debugInfo:
      process.env.NODE_ENV === "development"
        ? err.stack
        : "Check logs for stack trace",
  });
});

export default app;
