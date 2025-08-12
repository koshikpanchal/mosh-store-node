const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

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
