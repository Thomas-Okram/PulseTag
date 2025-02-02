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

// Middleware to handle requests and dynamically allow CORS for trusted origins
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173", // Development frontend
    "https://pulsetag-technologies.onrender.com", // Production frontend
  ];

  const origin = req.headers.origin || "";

  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
  }

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Debugging Middleware to log all incoming requests
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

// Define API routes
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
