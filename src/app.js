const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");

const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

connectDB()
  .then(() => {
    console.log("database is connected successfully");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => {
    console.error(err, "Database is not connected");
  });
