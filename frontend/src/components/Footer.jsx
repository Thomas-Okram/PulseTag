import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-transparent py-10">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 backdrop-blur-xl rounded-xl shadow-lg"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-white space-y-8 lg:space-y-0">
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 mb-4">
              PulseTag Technologies
            </h2>
            <p className="text-gray-300">
              Redefining the way you connect. Smart cards for smart people.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="/about"
                  className="hover:text-white transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-white transition duration-300"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-4">
              Subscribe to Newsletter
            </h3>
            <form className="flex flex-col lg:flex-row items-center lg:items-stretch space-y-4 lg:space-y-0 lg:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 w-full lg:w-auto"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 text-white font-semibold hover:scale-105 transform transition duration-300 shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white hover:text-red-500 transition duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-pink-500 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-600 transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PulseTag Technologies. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
