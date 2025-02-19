import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function ManageOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-6 lg:px-16"
      >
        <div className="w-full max-w-screen-lg bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 sm:p-12">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Orders</h1>
            <p className="text-lg text-gray-300">
              Track and manage customer orders efficiently.
            </p>
          </header>

          {/* Placeholder Section */}
          <div className="bg-gray-800/60 rounded-lg p-10 text-center shadow-lg">
            <p className="text-gray-400 text-lg">
              Order management features will be added here.
            </p>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
