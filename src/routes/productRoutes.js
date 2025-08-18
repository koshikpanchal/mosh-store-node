const express = require("express");
const mongoose = require("mongoose");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");
const Product = require("../models/product");

const productRoutes = express.Router();

productRoutes.post(
  "/add",
  authMiddleware,
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const { name, price, description, categoryId } = req.body;

      // Validate product data
      if (!name || !price || !description || !categoryId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "Invalid categoryId" });
      }

      // Create a new product
      const product = new Product({
        name,
        price,
        description,
        categoryId,
      });

      await product.save();

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      console.error("Error creating product", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get all products by categoryId
productRoutes.get("/by-category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const products = await Product.find({ categoryId }).populate("categoryId", [
      "name",
    ]);

    res.json({ data: products });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

//get product by productId
productRoutes.get("/by-id/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const product = await Product.findById(productId).populate("categoryId", [
      "name",
    ]);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data: product });
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

module.exports = productRoutes;
