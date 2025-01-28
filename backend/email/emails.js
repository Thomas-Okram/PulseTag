import { transporter, sender } from "./email.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`, // Sender name and email
      to: email, // Recipient email
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    console.log("Verification email sent successfully", info.messageId);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to PulseTag Technologies",
      html: `
        <p>Hello ${name},</p>
        <p>Welcome to PulseTag Technologies! We're thrilled to have you on board.</p>
        <p>Best regards,<br>Team PulseTag Technologies</p>
      `,
    });

    console.log("Welcome email sent successfully", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Password reset email sent successfully", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email", error);
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
      "Password reset success email sent successfully",
      info.messageId
    );
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(
      `Error sending password reset success email: ${error.message}`
    );
  }
};
