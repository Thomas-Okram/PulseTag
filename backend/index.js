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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// CORS Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development frontend
      "https://pulsetag-technologies.onrender.com", // Production frontend
    ],
    credentials: true, // Allow sending cookies in cross-origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Handle CORS preflight requests explicitly
app.options("*", cors());

// Debugging Middleware for Logging Requests
app.use((req, res, next) => {
  console.log("🔹 Request Method:", req.method);
  console.log("🔹 Request Origin:", req.headers.origin);
  console.log("🔹 Request Path:", req.path);
  console.log("🔹 Request Headers:", req.headers);
  next();
});

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");
  console.log("✅ Serving static files from:", frontendPath);

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Connect to the database and start the server
app.listen(PORT, () => {
  connectDB();
  console.log("✅ Server is running on port:", PORT);
});
