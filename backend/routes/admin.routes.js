import express from "express";
import {
  getAllUsers,
  deactivateUser,
  impersonateUser,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers); // Get all users
router.put("/users/:userId/deactivate", verifyToken, deactivateUser); // Deactivate user
router.post("/users/:userId/impersonate", verifyToken, impersonateUser); // Impersonate user

export default router;
