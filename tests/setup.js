// Example using mongodb-memory-server
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const {
  createMockUser,
  createMockProduct,
  createMockCart,
  createMockCategory,
} = require("./utils/mockData");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log("MongoDB in-memory server started");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

let testUser, testProduct, testCart, testCategory;

beforeEach(async () => {
  // Clear the database before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // Create mock data
  testUser = await createMockUser();
  testCategory = await createMockCategory();
  testProduct = await createMockProduct();
  // testCart = await createMockCart(testUser._id, testProduct._id);
});
