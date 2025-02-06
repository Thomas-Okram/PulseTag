import mongoose from "mongoose";

const pendingVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpiresAt: { type: Date, required: true },
});

export const PendingVerification = mongoose.model(
  "PendingVerification",
  pendingVerificationSchema
);
