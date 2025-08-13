const express = require("express");
const { validateSignupData } = require("../validator/validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // fetching user from database
    const user = await User.findOne({ email: email });

    res.json({ data: user });
  } catch (error) {
    console.error("error in registering user", error);
  }
});

module.exports = authRoutes;
