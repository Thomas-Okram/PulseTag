import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Customer Information
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true }, // Optional email field
    customerPhone: { type: String, required: true, trim: true }, // Required phone field

    // Ordered Products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 }, // Product quantity
        price: { type: Number, required: true }, // Price at the time of order
      },
    ],

    // Payment Information
    totalAmount: { type: Number, required: true, min: 0 }, // Total order amount
    paymentMethod: {
      type: String,
      required: true,
      enum: ["razorpay", "paypal", "stripe", "cod"], // Supported payment methods
      default: "cod", // Default is Cash on Delivery
    },
    transactionId: { type: String, default: null }, // Payment transaction ID
    paymentStatus: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "paid", "refunded"], // Payment statuses
    },

    // Order Status
    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    },

    // Shipping Information
    shippingMethod: {
      type: String,
      required: true,
      enum: ["standard", "express", "same-day"],
      default: "standard", // Default shipping method
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Additional Information
    notes: { type: String, trim: true }, // Optional notes for the order
    couponCode: { type: String, trim: true }, // Optional coupon code
    discount: { type: Number, default: 0 }, // Applied discount amount

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
