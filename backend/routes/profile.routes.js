import express from "express";
import {
  updateProfile,
  getProfile,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Update profile (protected route)
router.put("/", verifyToken, updateProfile);

// Fetch profile by user ID (protected route)
router.get("/:id", verifyToken, async (req, res, next) => {
  console.log("🔹 Profile Route Hit - GET /api/profile/:id");
  console.log("🔹 Request Params:", req.params);
  console.log("🔹 Request Headers:", req.headers);

  try {
    // Delegate to the controller
    await getProfile(req, res);
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
