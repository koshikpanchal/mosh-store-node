const mongoose = require("mongoose");
const Product = require("./product");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Static method to find or create a cart for a user
cartSchema.statics.findOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId });
  if (!cart) {
    cart = new this({ userId, products: [], totalPrice: 0 });
    await cart.save();
  }
  return cart;
};

// Method to add a product to the cart
cartSchema.methods.addProduct = async function (productId) {
  const productIndex = this.products.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (productIndex > -1) {
    this.products[productIndex].quantity += 1;
  } else {
    this.products.push({ productId, quantity: 1 });
  }

  this.totalPrice = await this.calculateTotalPrice();
};

// Method to calculate the total price of the cart
cartSchema.methods.calculateTotalPrice = async function () {
  let totalPrice = 0;
  for (const item of this.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      totalPrice += item.quantity * product.price;
    }
  }
  this.totalPrice = totalPrice;
  return this.totalPrice;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
