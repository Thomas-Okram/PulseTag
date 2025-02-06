import { Profile } from "../models/profile.model.js"; // Import the Profile model
import { PendingVerification } from "../models/pendingVerification.model.js";

import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../email/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate input
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // Check if a user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Check if a pending verification already exists
    const pendingVerificationExists = await PendingVerification.findOne({
      email,
    });
    if (pendingVerificationExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Verification is already pending for this email",
        });
    }

    // Hash the password and generate a verification token
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save pending verification
    await PendingVerification.create({
      email,
      name,
      hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please check your inbox to verify your email.",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // Find the pending verification record
    const pendingVerification = await PendingVerification.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!pendingVerification) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Create the user in the User collection
    const user = new User({
      email: pendingVerification.email,
      name: pendingVerification.name,
      password: pendingVerification.hashedPassword,
      isVerified: true,
    });

    await user.save();

    // Create the user's profile
    const profile = new Profile({
      user: user._id,
      name: user.name,
      email: user.email,
    });

    await profile.save();

    // Remove the pending verification entry
    await PendingVerification.deleteOne({ email: pendingVerification.email });

    // Send a welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate a token and set it as a cookie
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetURL = `https://pulsetag-technologies.onrender.com/reset-password/${resetToken}`;

    console.log("🔹 Sending Password Reset Email to:", user.email);
    console.log("🔹 Reset URL:", resetURL);

    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      user: { ...user._doc },
      token,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
