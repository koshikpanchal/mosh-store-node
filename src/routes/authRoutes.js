const express = require("express");
const { validateSignupData } = require("../validator/validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRoutes = express.Router();

authRoutes.post("/users/signup", async (req, res) => {
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

module.exports = authRoutes;
