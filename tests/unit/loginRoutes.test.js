const request = require("supertest");
const app = require("../../src/app");
const { createMockUser } = require("../utils/mockData");

describe("Login Endpoint", () => {
  let testUser;

  beforeEach(async () => {
    // Create a mock user for login
    testUser = await createMockUser();
  });

  it("should login with valid credentials and return a JWT", async () => {
    const res = await request(app).post("auth/login").send({
      email: testUser.email,
      password: "hashedpassword", // Use the plain password if your route hashes it
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 for missing email or password", async () => {
    const res = await request(app).post("/auth/login").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
