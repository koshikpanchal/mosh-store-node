const express = require("express");
const Cart = require("../models/cart");
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

    const cart = await Cart.findOrCreateCart(userId);

    await cart.addProduct(productId);

    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRoutes.post("/remove", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const { productId } = req.body;

    // Validate input data
    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await cart.removeProduct(productId);

    await cart.save();

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRoutes.post("/decreaseQuantity", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const { productId } = req.body;

    // Validate input data
    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await cart.decreaseProductQuantity(productId);
    await cart.save();
    res
      .status(200)
      .json({ message: "Item quantity decreased successfully", data: cart });
  } catch (error) {
    console.error("Error decreasing item quantity in cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRoutes.post("/clear", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Clear the cart
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = cartRoutes;
