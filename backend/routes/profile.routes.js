import express from "express";
import {
  updateProfile,
  getProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public route to fetch profile by user ID
router.get("/:id", async (req, res, next) => {
  console.log("🔹 Profile Route Hit - GET /api/profile/:id");
  console.log("🔹 Request Params:", req.params);
  console.log("🔹 Request Headers:", req.headers);

  try {
    // Call the controller to fetch the profile
    await getProfile(req, res);
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Protected route to update profile
router.put("/", verifyToken, updateProfile);

// Protected route to delete profile
router.delete("/", verifyToken, deleteProfile);

export default router;
