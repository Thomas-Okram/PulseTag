import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  // State to manage quantity and total price
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  // Update total price whenever quantity changes
  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity]);

  // Handle purchase button click
  const handlePurchase = () => {
    if (!product) {
      console.error("❌ No product found, cannot proceed to checkout!");
      return;
    }

    console.log("✅ Navigating to checkout with:", {
      product,
      quantity,
      totalPrice,
    });

    // Navigate to checkout with all required details
    navigate("/checkout", {
      state: {
        products: [
          {
            id: product.id, // Use `id` if the backend expects `id` instead of `productId`
            name: product.name,
            price: product.price,
            quantity,
            totalPrice, // Ensure this is the total for this product
          },
        ],
        totalAmount: totalPrice, // Use `totalAmount` to match backend naming
      },
    });
  };

  // Render a warning if no product is found
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        ⚠️ Product not found! Please go back and select a product.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Buy {product.name}
        </h1>

        <div className="relative w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl">
          <img
            src={product.frontImage}
            alt={product.name}
            className="w-full h-64 object-cover rounded-xl shadow-lg mb-6"
          />

          <p className="text-lg text-gray-300 mb-4 text-center">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-center mb-6">
            ₹{product.price} <span className="text-gray-400">each</span>
          </p>

          <div className="flex justify-center items-center gap-6 mb-6">
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              className="w-12 h-12 flex items-center justify-center text-2xl bg-white/20 hover:bg-blue-500/30 border border-white/40 rounded-xl transition-all"
            >
              -
            </button>
            <span className="text-2xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-12 h-12 flex items-center justify-center text-2xl bg-white/20 hover:bg-blue-500/30 border border-white/40 rounded-xl transition-all"
            >
              +
            </button>
          </div>

          <p className="text-3xl font-extrabold text-center mb-6">
            💰 ₹{totalPrice}
          </p>

          <button
            onClick={handlePurchase}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          >
            🚀 Confirm Purchase
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
