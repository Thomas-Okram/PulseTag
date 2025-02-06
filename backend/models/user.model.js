import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profilePicture: String,
  callNow: [String],
  whatsapp: String,
  sms: String,
  email: String,
  businessHours: {
    monday: { start: String, end: String, open: Boolean },
    tuesday: { start: String, end: String, open: Boolean },
    wednesday: { start: String, end: String, open: Boolean },
    thursday: { start: String, end: String, open: Boolean },
    friday: { start: String, end: String, open: Boolean },
    saturday: { start: String, end: String, open: Boolean },
    sunday: { start: String, end: String, open: Boolean },
  },
  socialLinks: [
    {
      platform: String,
      url: String,
      customCTA: String,
    },
  ],
  websiteLink: String,
  availabilityNote: String,
  location: String,
  qrCode: String,
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    profile: profileSchema, // Embedded profile schema
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
