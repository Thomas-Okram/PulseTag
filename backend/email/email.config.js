import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
  },
});

export const sender = {
  email: process.env.GMAIL_EMAIL,
  name: "PulseTag Technologies",
};
