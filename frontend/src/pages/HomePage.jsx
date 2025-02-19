import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <p className="text-center">No products available</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-gray-400">{product.description}</p>
                <p className="text-xl font-bold mt-2">${product.price}</p>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
