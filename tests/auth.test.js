const request = require("supertest");
const express = require("express");
const router = express.Router();
var should = require("should");

// Mock the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", router);

// Register Route Test
describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request("http://localhost:3000/auth")
      .post("/register")
      .send(newUser)
      .expect(201);

    response.statusCode.should.eql(201);
    response.body.should.have.property(
      "message",
      "User registered successfully"
    );
  });
});

// Login Route Test
describe("POST /auth/login", () => {
  it("should authenticate a user and return an access token", async () => {
    const credentials = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request("http://localhost:3000/auth")
      .post("/login")
      .send(credentials)
      .expect(200);

    response.statusCode.should.eql(200);
    response.body.should.have.property("accessToken");
  });
});
