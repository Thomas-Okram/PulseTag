import Product from "../models/product.model.js";
import multer from "multer";
import path from "path";

// ✅ Multer Storage Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});
const upload = multer({ storage }).fields([
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]);

// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // ✅ Append full image URLs to the response
    const updatedProducts = products.map((product) => ({
      ...product._doc,
      frontImage: `${process.env.API_BASE_URL}/uploads/${product.frontImage}`,
      backImage: `${process.env.API_BASE_URL}/uploads/${product.backImage}`,
    }));

    console.log("🔹 API Response Products:", updatedProducts); // ✅ Log products in the backend

    res.status(200).json({ success: true, products: updatedProducts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Create Product (With Image Upload)
export const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed", error: err });

    try {
      const { name, description, price, category, stock } = req.body;
      if (!req.files.frontImage || !req.files.backImage) {
        return res.status(400).json({
          success: false,
          message: "Both front and back images are required",
        });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        frontImage: req.files.frontImage[0].filename,
        backImage: req.files.backImage[0].filename,
      });

      await newProduct.save();
      res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    }
  });
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed", error: err });

    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.files.frontImage)
        updateData.frontImage = req.files.frontImage[0].filename;
      if (req.files.backImage)
        updateData.backImage = req.files.backImage[0].filename;

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });

      res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    }
  });
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};
