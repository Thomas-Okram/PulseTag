import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { generateQRCode } from "../utils/qrCodeGenerator.js";

// Create or Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "Profile data is required" });
    }

    // Check if profile already exists for the user
    let userProfile = await Profile.findOne({ user: req.userId });

    if (userProfile) {
      // Update the existing profile
      userProfile = await Profile.findOneAndUpdate(
        { user: req.userId },
        { $set: profile },
        { new: true }
      );
    } else {
      // Create a new profile
      profile.user = req.userId;
      userProfile = new Profile(profile);
      await userProfile.save();
    }

    // Generate a new QR code URL
    const profileUrl = `${process.env.CLIENT_URL_DEPLOYED}/profile/${req.userId}`;
    userProfile.qrCode = await generateQRCode(profileUrl);
    await userProfile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Profile by User ID
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const profile = await Profile.findOne({ user: id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
