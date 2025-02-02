import { User } from "../models/user.model.js";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isActive: false });
    res
      .status(200)
      .json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Impersonate User (Login as another user)
export const impersonateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a new token for the impersonated user
    const token = generateTokenAndSetCookie(res, user._id);

    res
      .status(200)
      .json({ success: true, message: "Impersonation successful", token });
  } catch (error) {
    console.error("Error in impersonateUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
