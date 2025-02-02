import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    visitorIP: String,
  },
  { timestamps: true }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
