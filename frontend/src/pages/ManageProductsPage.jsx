import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import { Navigation, Pagination } from "swiper/modules"; // Import Swiper modules
import "swiper/css"; // Swiper core styles
import "swiper/css/navigation"; // Swiper navigation styles
import "swiper/css/pagination"; // Swiper pagination styles
import Footer from "../components/Footer";

// Set dynamic base URL for API
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7000"
    : "https://pulsetag-technologies.onrender.com";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    frontImage: null,
    backImage: null,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("category", formData.category);
    productData.append("stock", formData.stock);

    if (formData.frontImage instanceof File) {
      productData.append("frontImage", formData.frontImage);
    }
    if (formData.backImage instanceof File) {
      productData.append("backImage", formData.backImage);
    }

    try {
      if (editingProduct) {
        await axios.put(
          `${API_BASE_URL}/api/products/${editingProduct._id}`,
          productData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, productData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Handle Image Change
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFormData({ ...formData, frontImage: file });
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, backImage: file });
        setBackPreview(URL.createObjectURL(file));
      }
    }
  };

  // Handle Edit
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      frontImage: null, // Reset to null for file input
      backImage: null, // Reset to null for file input
    });

    // Use the URLs from the backend to set image previews
    setFrontPreview(
      product.frontImage ? `${API_BASE_URL}/uploads/${product.frontImage}` : ""
    );
    setBackPreview(
      product.backImage ? `${API_BASE_URL}/uploads/${product.backImage}` : ""
    );

    setEditingProduct(product); // Set the product for editing
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      frontImage: null,
      backImage: null,
    });
    setEditingProduct(null);
    setFrontPreview("");
    setBackPreview("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Manage Products</h1>

        {/* Product Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            encType="multipart/form-data"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <div>
              <label className="block mb-2">Upload Front Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "front")}
                className="p-2 bg-gray-700 rounded text-white"
              />
              {frontPreview && (
                <img
                  src={frontPreview}
                  alt="Front Preview"
                  className="w-32 h-32 mt-2 rounded"
                />
              )}
            </div>
            <div>
              <label className="block mb-2">Upload Back Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "back")}
                className="p-2 bg-gray-700 rounded text-white"
              />
              {backPreview && (
                <img
                  src={backPreview}
                  alt="Back Preview"
                  className="w-32 h-32 mt-2 rounded"
                />
              )}
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white col-span-2"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 col-span-2"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Product List
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center w-full max-w-sm"
            >
              {/* Product Images with Swiper */}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full"
              >
                {["frontImage", "backImage"].map((imageType, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={
                        product.frontImage
                          ? product.frontImage
                          : "/default-placeholder.png"
                      }
                      alt={`${product.name} Front`}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Product Details */}
              <h3 className="text-xl font-semibold mt-4 text-center">
                {product.name}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">
                {product.description}
              </p>
              <p className="mt-4 text-lg font-bold">₹{product.price}</p>
              <p className="text-gray-400 text-sm">Stock: {product.stock}</p>

              {/* Actions */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
