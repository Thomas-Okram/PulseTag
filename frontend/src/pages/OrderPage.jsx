import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBox, FaTimesCircle, FaShoppingBag } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7000"
    : "https://pulsetag-technologies.onrender.com";

export default function OrderPage() {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.token) {
        setError("You need to be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.data.success && response.data.orders.length > 0) {
          setOrders(response.data.orders);
        } else {
          setError("You haven’t placed any orders yet.");
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />

      {/* Animated Background Elements */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] opacity-30 top-10 left-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] opacity-30 bottom-10 right-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, delay: 2 }}
      />

      {/* Hero Section */}
      <motion.section
        className="text-center py-20 px-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          📦 Your Orders
        </h1>
        <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
          Track your recent purchases and order status in one place.
        </p>
      </motion.section>

      {/* Order Details Section */}
      <motion.section
        className="max-w-4xl mx-auto py-16 px-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 mb-24"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center text-yellow-400">
          Recent Orders
        </h2>

        {/* Loading State */}
        {loading && (
          <motion.p
            className="mt-6 text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⏳ Fetching your order details...
          </motion.p>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400 text-lg">
              <FaTimesCircle className="inline-block mr-2" />
              {error}
            </p>
            <p className="text-gray-300 mt-2">
              Browse our store and place your first order today.
            </p>
            <motion.a
              href="/order"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🛒 Browse Products
            </motion.a>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <motion.div
            className="mt-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="p-6 bg-gray-800/40 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 hover:scale-105 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-300 flex items-center">
                    <FaBox className="mr-2 text-yellow-400" />
                    {order.productName}
                  </h3>
                  <span
                    className={`text-lg font-medium px-3 py-1 rounded-lg ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-300 mt-2">
                  Order ID: <span className="text-blue-400">{order._id}</span>
                </p>
                <p className="text-gray-300">
                  Quantity:{" "}
                  <span className="text-blue-300">{order.quantity}</span>
                </p>
                <p className="text-gray-300">
                  Total Price:{" "}
                  <span className="text-green-400">${order.totalPrice}</span>
                </p>

                {/* Order Date */}
                <p className="text-gray-400 text-sm mt-2">
                  📅 Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      <Footer />
    </motion.div>
  );
}
