import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String, // Added name field for profile
    profilePicture: String,
    bio: String,
    callNow: [String],
    whatsapp: String,
    email: String,
    sms: String,
    vCard: String,
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    availabilityNote: String,
    isOpenNow: Boolean,
    socialLinks: [
      {
        platform: String,
        url: String,
        customCTA: String,
      },
    ],
    websiteLinks: [
      {
        url: String,
        previewThumbnail: String,
      },
    ],
    qrCode: String,
    location: {
      address: String,
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
