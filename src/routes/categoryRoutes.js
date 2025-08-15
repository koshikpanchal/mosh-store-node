const express = require("express");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");
const Category = require("../models/category");

const categoryRoutes = express.Router();

categoryRoutes.post(
  "/add",
  authMiddleware,
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const { name } = req.body;

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const category = new Category({ name });

      await category.save();

      res.json({ message: `Category ${name} created successfully` });
    } catch (error) {
      console.error("Error creating category", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = categoryRoutes;
