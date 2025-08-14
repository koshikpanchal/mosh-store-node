const express = require("express");
const User = require("../models/user");

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // fetching user from database
    const user = await User.findOne({ email: email });
    if (await user.isValidPassword(password)) {
      const accessToken = await user.getAccessToken();
      const refreshToken = await user.getRefreshToken();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
      });
      res.json({ token: accessToken });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("error in registering user", error);
  }
});

module.exports = authRoutes;
