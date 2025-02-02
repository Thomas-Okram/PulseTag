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
router.get("/:id", verifyToken, getProfile);

export default router;
