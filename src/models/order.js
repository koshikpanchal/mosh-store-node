const mongoose = require("mongoose");
const Cart = require("./cart");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalPrice: { type: Number },
  },
  { timeStamnp: true }
);

orderSchema.statics.createOrder = async function (userId, cartId) {
  const cart = await Cart.findById(cartId).populate("products.productId");

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const items = cart.products;

  const newOrder = new Order({
    user: userId,
    items,
    totalPrice: cart.totalPrice,
    paymentStatus: "pending",
  });

  await newOrder.save();

  const updatedCart = await Cart.findByIdAndUpdate(
    cartId,
    { products: [], totalPrice: 0 },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  // Optionally, you can clear the cart or update its status here
  await updatedCart.save();
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
