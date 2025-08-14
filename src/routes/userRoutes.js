const express = require("express");
const {
  validateSignupData,
  validateEditRequestData,
} = require("../validator/validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { authMiddleware } = require("../middleware/authMiddleware");

const userRoutes = express.Router();

// registering the user
userRoutes.post("/signup", async (req, res) => {
  try {
    //validate the input data
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    //encrypt the passsword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();

    res.json({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("error in registering user", error);
  }
});

//get the user information
userRoutes.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.json({
      data: user,
    });
  } catch (error) {
    console.error("error in registering user", error);
  }
});

// update user information
userRoutes.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate the request data
    if (!validateEditRequestData(req)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const loggedInUser = await User.findById(id);
    Object.keys(updateData).forEach(
      (key) => (loggedInUser[key] = updateData[key])
    );

    await loggedInUser.save();

    res.json({
      message: "User updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    console.error("error in updating user", error);
  }
});

// delete user
userRoutes.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("error in deleting user", error);
  }
});

module.exports = userRoutes;
