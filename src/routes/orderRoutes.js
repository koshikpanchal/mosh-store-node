const express = require("express");

const Order = require("../models/order");
const { authMiddleware } = require("../middleware/authMiddleware");

const orderRoutes = express.Router();

orderRoutes.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartId } = req.body;

    // Validate input data
    if (!cartId) {
      return res.status(400).json({ error: "cart ID is required" });
    }

    const order = await Order.createOrder(userId, cartId);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = orderRoutes;
