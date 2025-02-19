import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Glowing Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Glassmorphic Card */}
      <div className="relative p-8 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 text-white">
        <h2 className="text-3xl font-semibold text-center">
          ✅ Order Confirmed!
        </h2>
        <p className="mt-4 text-center text-lg">
          Thank you for your purchase! Your{" "}
          <span className="text-blue-400">Order ID</span> is:
        </p>

        {/* Order ID Display */}
        <div className="mt-4 text-center bg-white/20 p-3 rounded-lg text-lg font-semibold tracking-wide">
          {orderId}
        </div>

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="mt-6 w-full py-3 text-lg font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
