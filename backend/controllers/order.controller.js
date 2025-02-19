import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ Create a new order (before payment)
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      products = [],
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !totalAmount || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Ensure `products` is an array
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products array is required" });
    }

    // Calculate total price
    const calculatedTotal = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Validate total price
    if (calculatedTotal !== totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Total amount mismatch" });
    }

    // Create new order
    const newOrder = new Order({
      customerName,
      phone,
      products,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    await newOrder.save();

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Create a Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", orderId } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_rcptid_${orderId}`,
      payment_capture: 1, // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// ✅ Verify payment & update order status
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Update order in database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        paymentDetails: { razorpay_order_id, razorpay_payment_id },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

// ✅ Update an existing order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("products.productId");

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

// ✅ Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};
