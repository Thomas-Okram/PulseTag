import express from "express";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder); // Create an order
router.get("/", getOrders); // Get all orders
router.put("/:id", updateOrder); // Update a specific order
router.delete("/:id", deleteOrder); // Delete a specific order

// ✅ Razorpay Payment Routes
router.post("/razorpay-order", createRazorpayOrder); // Create a Razorpay order
router.post("/verify-payment", verifyPayment); // Verify payment & update order

export default router;
