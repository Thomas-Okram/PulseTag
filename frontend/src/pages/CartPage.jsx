import React from "react";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold text-center py-6">Your Cart</h1>
      <div className="container mx-auto px-6">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty!</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
