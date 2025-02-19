import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulating form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      <Navbar />

      {/* Animated Glowing Background */}
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] opacity-30 top-10 left-20 animate-pulse" />
      <div className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] opacity-30 bottom-10 right-20 animate-pulse delay-2000" />

      {/* Hero Section */}
      <motion.section
        className="text-center py-20 px-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Get in Touch with Us
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
          Have questions or need support? We’re here to help! Contact us today
          and let’s make great things happen together.
        </p>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="max-w-3xl mx-auto py-16 px-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Contact Us
        </h2>
        <p className="text-lg text-gray-300 text-center mt-2">
          Have any questions or inquiries? Fill out the form below and we'll get
          back to you via email.
        </p>

        {/* Success Message */}
        {isSubmitted ? (
          <motion.div
            className="mt-6 text-center text-green-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            ✅ Your message has been sent! We will get back to you soon.
          </motion.div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <label className="text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <label className="text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </motion.div>

            {/* Phone Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <label className="text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </motion.div>

            {/* Subject Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <label className="text-gray-300">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <label className="text-gray-300">Your Message</label>
              <textarea
                name="message"
                placeholder="Type your message..."
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope className="text-lg" /> Send Message
            </motion.button>
          </form>
        )}
      </motion.section>

      {/* Social Media Links */}
      <motion.section
        className="py-16 px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-purple-400">Connect with Us</h2>
        <div className="flex justify-center gap-6 mt-4">
          <FaFacebook className="text-3xl text-blue-500 cursor-pointer" />
          <FaTwitter className="text-3xl text-blue-400 cursor-pointer" />
          <FaInstagram className="text-3xl text-pink-500 cursor-pointer" />
          <FaLinkedin className="text-3xl text-blue-600 cursor-pointer" />
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
