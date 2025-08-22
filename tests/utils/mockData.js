const User = require("../../src/models/user");
const Product = require("../../src/models/product");
const Cart = require("../../src/models/cart");
const Category = require("../../src/models/category");

async function createMockUser() {
  const user = new User({
    firstName: "Test",
    lastName: "Mock",
    email: "test@example.com",
    password: "hashedpassword",
  });
  await user.save();
  return user;
}

async function createMockProduct() {
  const product = new Product({
    name: "Test Product",
    price: 10,
    description: "A test product",
    categoryId: "689f1b6e1ac137973e070718",
  });
  await product.save();
  return product;
}

async function createMockCart(userId, productId) {
  const cart = new Cart({
    products: [{ productId, quantity: 2 }],
    totalPrice: 20,
  });
  await cart.save();
  return cart;
}

async function createMockCategory() {
  const category = new Category({
    name: "Test Category",
    description: "A test category",
  });
  await category.save();
  return category;
}

module.exports = {
  createMockUser,
  createMockProduct,
  createMockCart,
  createMockCategory,
};
