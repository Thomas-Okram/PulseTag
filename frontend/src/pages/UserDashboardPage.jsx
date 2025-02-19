import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import here, inside the component
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { ShoppingCart, CreditCard, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // Correct import for Pagination module
import "swiper/css";
import "swiper/css/pagination";

// Determine the API base URL based on the environment
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7000"
    : "https://pulsetagapp.com";

// Backend API call to fetch products
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    if (response.data?.success && Array.isArray(response.data.products)) {
      return response.data.products;
    } else {
      console.error("Invalid API response:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Always return an array to prevent undefined issues
  }
};

export default function UserDashboardPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize inside the component

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      console.log("Fetched Products:", data); // Debugging fetched data
      setProducts(data);
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <h1 className="text-5xl font-bold mb-4">Welcome to PulseTag Store!</h1>
        <p className="text-lg text-gray-300 mb-8">
          Discover our modern business card collection and take your networking
          to the next level.
        </p>
        <a
          href="#products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          Browse Products
        </a>
      </header>

      {/* Product Grid Section */}
      <main className="p-10">
        <h2 className="text-4xl font-bold mb-6 text-center">Our Products</h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="products"
        >
          {Array.isArray(products) && products.length === 0 ? (
            <p className="text-center col-span-full">
              No products available at the moment.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                {/* Product Image Carousel */}
                <Swiper
                  modules={[Pagination]} // Add the Pagination module here
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }} // Enable clickable dots
                  className="rounded-lg"
                >
                  {product.frontImage && (
                    <SwiperSlide>
                      <img
                        src={product.frontImage}
                        alt="Front of the card"
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) =>
                          console.error("Image failed to load:", e.target.src)
                        }
                      />
                    </SwiperSlide>
                  )}
                  {product.backImage && (
                    <SwiperSlide>
                      <img
                        src={product.backImage}
                        alt="Back of the card"
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) =>
                          console.error("Image failed to load:", e.target.src)
                        }
                      />
                    </SwiperSlide>
                  )}
                </Swiper>

                {/* Product Details */}
                <h3 className="text-2xl font-semibold mt-4">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <p className="text-xl font-bold mb-4">₹{product.price}</p>

                {/* Rating Section */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">
                    ({product.rating || "N/A"})
                  </span>
                </div>

                {/* Reviews Section */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">Reviews:</h4>
                  {Array.isArray(product.reviews) &&
                  product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                      <p key={idx} className="text-gray-300">
                        <span className="font-semibold">{review.user}:</span>{" "}
                        {review.comment}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No reviews yet.</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-between space-x-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-1/2">
                    <ShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button
                    onClick={() =>
                      navigate("/buy-now", {
                        state: { product }, // Pass the product data to the Checkout page
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-1/2"
                  >
                    <CreditCard className="mr-2" /> Buy Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
