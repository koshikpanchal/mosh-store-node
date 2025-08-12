const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number },
    items: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" },
  },
  { timeStamnp: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
