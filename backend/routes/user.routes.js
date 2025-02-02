import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/profile", verifyToken, getUserProfile);

// Update logged-in user's profile
router.put("/profile", verifyToken, updateUserProfile);

export default router;
