import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ManageEcommercePage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-6 lg:px-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-12 w-full max-w-screen-xl">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              Manage E-commerce
            </h1>
            <p className="text-lg text-gray-300">
              Customize your products, manage orders, and configure store
              settings.
            </p>
          </header>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Manage Products */}
            <Link
              to="/admin/products"
              className="bg-white/10 backdrop-blur-md border border-white/10 p-12 rounded-xl shadow-lg hover:scale-105 transform transition text-center"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Manage Products
              </h2>
              <p className="text-gray-300">
                Add, edit, or remove products from your store.
              </p>
            </Link>

            {/* Manage Orders */}
            <Link
              to="/admin/orders"
              className="bg-white/10 backdrop-blur-md border border-white/10 p-12 rounded-xl shadow-lg hover:scale-105 transform transition text-center"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Manage Orders
              </h2>
              <p className="text-gray-300">Track and manage customer orders.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
