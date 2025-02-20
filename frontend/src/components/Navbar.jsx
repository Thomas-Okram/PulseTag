import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { logout, user } = useAuthStore(); // Get user data

  return (
    <nav className="backdrop-blur-lg bg-white/10 text-white border-b border-white/20 shadow-lg sticky top-0 z-50 p-4 flex justify-between items-center">
      <div className="font-bold text-xl">PulseTag Technologies</div>
      <div className="space-x-8 flex items-center text-lg">
        <Link to="/" className="hover:text-blue-300 transition">
          Home
        </Link>
        {user?._id && ( // Ensure user is authenticated before linking
          <Link
            to={`/profile/${user._id}`}
            className="hover:text-blue-300 transition"
          >
            Profile
          </Link>
        )}
        <Link to="/order" className="hover:text-blue-300 transition">
          Order
        </Link>
        <Link to="/about" className="hover:text-blue-300 transition">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-blue-300 transition">
          Contact Us
        </Link>
      </div>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-white flex items-center"
      >
        <LogOut className="mr-2" /> Logout
      </button>
    </nav>
  );
}
