import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Connect to Database Before Starting the Server
connectDB()
  .then(() => {
    console.log("✅ Database Connected Successfully");

    // ✅ Middleware for Parsing JSON & Cookies
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // Supports URL-encoded data
    app.use(cookieParser());

    // ✅ CORS Middleware
    app.use(
      cors({
        origin: [
          "http://localhost:5173", // Development frontend
          "https://pulsetag-technologies.onrender.com", // Production frontend
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      })
    );

    // ✅ Handle CORS Preflight Requests Explicitly
    app.options("*", cors());

    // ✅ Debugging Middleware for Logging Requests
    app.use((req, res, next) => {
      console.log(`🔹 ${req.method} Request: ${req.path}`);
      next();
    });

    // ✅ Serve Uploaded Images (Ensure "uploads" Directory Exists)
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // ✅ Define API Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/profile", profileRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);

    // ✅ Health Check Route
    app.get("/api/health", (req, res) => {
      res.status(200).json({ success: true, message: "Server is running!" });
    });

    // ✅ Serve Static Frontend Files in Production
    if (process.env.NODE_ENV === "production") {
      const frontendPath = path.join(__dirname, "frontend", "dist");
      console.log("✅ Serving Static Files from:", frontendPath);

      app.use(express.static(frontendPath));

      app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
      });
    }

    // ✅ Global Error Handling Middleware
    app.use((err, req, res, next) => {
      console.error("❌ Error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });

    // ✅ Start the Server After Successful DB Connection
    app.listen(PORT, () => console.log(`✅ Server Running on Port: ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
  });
