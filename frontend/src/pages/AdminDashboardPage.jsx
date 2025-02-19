import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Users, ClipboardList } from "lucide-react";
import Footer from "../components/Footer";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1c1c28] via-[#181822] to-[#10101b] text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Admin Dashboard Content */}
      <main className="flex-1 flex items-center justify-center px-8 lg:px-20 py-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-14 w-full max-w-5xl">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-6">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-400">
              Manage user accounts and customize your e-commerce platform.
            </p>
          </header>

          {/* Admin Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
            {/* Manage User Accounts */}
            <Link
              to="/admin/users"
              className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 hover:bg-white/20 text-center"
            >
              <Users className="w-20 h-20 mx-auto mb-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-white mb-3">
                Manage User Accounts
              </h2>
              <p className="text-gray-300">View and manage registered users.</p>
            </Link>

            {/* Manage E-commerce Customization */}
            <Link
              to="/admin/ecommerce"
              className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 hover:bg-white/20 text-center"
            >
              <ClipboardList className="w-20 h-20 mx-auto mb-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-white mb-3">
                Manage E-commerce
              </h2>
              <p className="text-gray-300">
                Customize products, orders, and settings.
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
