const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { authMiddleware } = require("../middleware/authMiddleware");

const cartRoutes = express.Router();

cartRoutes.get("/get", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ data: cart });
  } catch (error) {
    console.error("Error fetching cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRoutes.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const { productId } = req.body;

    // Validate input data
    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [], totalPrice: 0 });
    }

    // Check if product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingProductIndex > -1) {
      // Increment quantity if product already exists
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Add new product to the cart with quantity 1
      cart.products.push({ productId, quantity: 1 });
    }

    // Recalculate total price
    let totalPrice = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += item.quantity * product.price;
      }
    }
    cart.totalPrice = totalPrice;

    // Save the cart
    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = cartRoutes;
