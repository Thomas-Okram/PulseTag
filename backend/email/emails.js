import { transporter, sender } from "./email.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

/**
 * Send Verification Email
 * @param {string} email - The user's email address
 * @param {string} verificationToken - The verification code/token
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const emailTemplate = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    );

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Verify your email",
      html: emailTemplate,
    });

    console.log("✅ Verification email sent successfully", info.messageId);
  } catch (error) {
    console.error("❌ Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

/**
 * Send Welcome Email
 * @param {string} email - The user's email address
 * @param {string} name - The user's name
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const emailTemplate = `
      <p>Hello ${name},</p>
      <p>Welcome to PulseTag Technologies! We're thrilled to have you on board.</p>
      <p>Best regards,<br>Team PulseTag Technologies</p>
    `;

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to PulseTag Technologies",
      html: emailTemplate,
    });

    console.log("✅ Welcome email sent successfully", info.messageId);
  } catch (error) {
    console.error("❌ Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    // ✅ Construct the correct reset password link
    const resetURL = `https://pulsetag-technologies.onrender.com/reset-password/${token}`;

    console.log("🔹 Sending Password Reset Email to:", email);
    console.log("🔹 Reset URL:", resetURL); // ✅ Debugging log to check the reset URL

    const emailTemplate = PASSWORD_RESET_REQUEST_TEMPLATE(resetURL);

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset your password",
      html: emailTemplate,
    });

    console.log("✅ Password reset email sent successfully", info.messageId);
  } catch (error) {
    console.error("❌ Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log(
      "✅ Password reset success email sent successfully",
      info.messageId
    );
  } catch (error) {
    console.error("❌ Error sending password reset success email", error);
    throw new Error(
      `Error sending password reset success email: ${error.message}`
    );
  }
};
