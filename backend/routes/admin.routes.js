import express from "express";
import {
  getAllUsers,
  deactivateUser,
  deleteUser, // Import the deleteUser controller
  makeAdmin,
  activateUser,
  dismissAdmin,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers); // Get all users
router.put("/users/:userId/deactivate", verifyToken, deactivateUser); // Deactivate user
router.delete("/users/:userId", verifyToken, deleteUser); // Delete user
router.put("/users/:userId/make-admin", verifyToken, makeAdmin);
router.put("/users/:userId/activate", verifyToken, activateUser);
router.put("/users/:userId/dismiss-admin", verifyToken, dismissAdmin);

export default router;
