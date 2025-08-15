const express = require("express");
const mongoose = require("mongoose");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");
const Product = require("../models/product");

const productRoutes = express.Router();

productRoutes.post(
  "/",
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

module.exports = productRoutes;
