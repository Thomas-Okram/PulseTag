import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePicture) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.profilePicture;

    // Upload the file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "profiles",
    });

    // Clean up the temp file
    fs.unlinkSync(file.tempFilePath);

    res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
