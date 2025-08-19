const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // fetching user from database
    const user = await User.findOne({ email: email });

    if (user && (await user.isValidPassword(password))) {
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
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("error in registering user", error);
  }
});

authRoutes.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "User unauthorized, No refresh token provided" });
    }

    // Verify the refresh token
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    //fertching user from database
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Generate a new access token
    const accessToken = await user.getAccessToken();
    res.json({ token: accessToken });
  } catch (error) {
    console.error("error in refreshing token", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = authRoutes;
