import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { loadRazorpay } from "../utils/razorpayLoader";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve `products` and `totalAmount` passed from the previous page
  const { products = [], totalAmount = 0 } = location.state || {};

  // State for shipping info
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Validate shipping info
  const validateShippingInfo = () => {
    const { name, phone, address, city, state, postalCode } = shippingInfo;
    if (!name || !phone || !address || !city || !state || !postalCode) {
      alert("⚠️ Please fill all the required fields.");
      return false;
    }
    return true;
  };

  // Handle UPI Payment
  const handleUPIPayment = async () => {
    if (!validateShippingInfo()) return;

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      alert("Failed to load payment gateway. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/api/payments/upi",
        {
          amount: totalAmount * 100, // Convert to smallest currency unit
          customerName: shippingInfo.name,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone,
        }
      );

      const { orderId, amount, currency, key } = response.data;

      const options = {
        key,
        amount,
        currency,
        name: "Your Business Name",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          alert("🎉 Payment Successful!");
          await axios.post("http://localhost:7000/api/orders", {
            customerName: shippingInfo.name,
            customerPhone: shippingInfo.phone,
            customerEmail: shippingInfo.email,
            totalAmount: amount / 100,
            paymentMethod: "upi",
            paymentStatus: "paid",
            orderStatus: "pending",
            shippingAddress: shippingInfo,
            products, // Include products in the payload
          });
          navigate("/thank-you");
        },
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("UPI Payment Error:", error);
      alert("⚠️ Payment failed!");
    }
  };

  // Handle Order Placement for COD or Razorpay
  const handleOrderPlacement = async () => {
    if (!validateShippingInfo()) {
      alert("⚠️ Please fill in all required fields correctly.");
      return;
    }

    const orderData = {
      customerName: shippingInfo.name,
      phone: shippingInfo.phone,
      totalAmount, // Ensure totalAmount is properly calculated
      paymentMethod, // E.g., "cod"
      shippingAddress: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pinCode: shippingInfo.pinCode,
      },
      products: products.map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        totalPrice: product.price * product.quantity,
      })),
    };

    console.log("📦 Order Payload:", orderData);

    try {
      const response = await axios.post(
        "http://localhost:7000/api/orders",
        orderData
      );

      if (response.data.success) {
        alert("🎉 Order placed successfully!");
        navigate("/thank-you");
      } else {
        alert(`⚠️ Order placement failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error(
        "❌ Order Placement Error:",
        error.response?.data || error.message
      );
      alert(
        "⚠️ Something went wrong while placing your order. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Checkout
        </h1>

        <div className="relative w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="John Doe"
                value={shippingInfo.name}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="9876543210"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">
                Email (Optional)
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="johndoe@example.com"
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">Address</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="Street, House No, Area"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300">City</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300">State</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Postal Code</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="123456"
                value={shippingInfo.postalCode}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    postalCode: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">
                Payment Method
              </label>
              <select
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="razorpay">Razorpay</option>
                <option value="upi">UPI Payment</option>
              </select>
            </div>

            <button
              onClick={
                paymentMethod === "upi"
                  ? handleUPIPayment
                  : handleOrderPlacement
              }
              className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            >
              ✅ Confirm Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
