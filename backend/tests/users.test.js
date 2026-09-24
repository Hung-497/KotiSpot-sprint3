const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let user;
let token;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});

  user = await User.create({
    email: "profile@example.com",
    firstName: "Test",
    lastName: "User",
    phone: "0401234567",
    bio: "Original bio",
    role: "seller",
    verifiedAt: new Date(),
  });

  token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "3d",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/users/me", () => {
  it("should reject profile access without authentication", async () => {
    await api.get("/api/users/me").expect(401);
  });

  it("should return the authenticated user's profile", async () => {
    const response = await api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user._id).toBe(user._id.toString());
    expect(response.body.user.email).toBe("profile@example.com");
    expect(response.body.user.firstName).toBe("Test");
    expect(response.body.user.lastName).toBe("User");
    expect(response.body.user.phone).toBe("0401234567");
    expect(response.body.user.bio).toBe("Original bio");
    expect(response.body.user.role).toBe("seller");
  });
});

describe("PATCH /api/users/me", () => {
  it("should reject profile updates without authentication", async () => {
    await api
      .patch("/api/users/me")
      .send({
        firstName: "Updated",
      })
      .expect(401);
  });

  it("should update editable fields without allowing protected fields to change", async () => {
    const originalVerifiedAt = user.verifiedAt;

    const response = await api
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Updated",
        lastName: "Profile",
        phone: "0507654321",
        bio: "Updated bio",
        email: "attacker@example.com",
        role: "administrator",
        verifiedAt: null,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user.firstName).toBe("Updated");
    expect(response.body.user.lastName).toBe("Profile");
    expect(response.body.user.phone).toBe("0507654321");
    expect(response.body.user.bio).toBe("Updated bio");

    expect(response.body.user.email).toBe("profile@example.com");
    expect(response.body.user.role).toBe("seller");
    expect(new Date(response.body.user.verifiedAt)).toEqual(originalVerifiedAt);
  });
});

describe("POST /api/users", () => {
  it("should not expose direct user creation", async () => {
    await api
      .post("/api/users")
      .send({
        email: "fake@example.com",
        role: "administrator",
      })
      .expect(404);
  });
});

describe("DELETE /api/users/me", () => {
  it("should reject account deletion without authentication", async () => {
    await api.delete("/api/users/me").expect(401);
  });

  it("should delete the authenticated user's account", async () => {
    const response = await api
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("User deleted successfully");

    const deletedUser = await User.findById(user._id);

    expect(deletedUser).toBeNull();
  });
});

describe("GET /api/users", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/users").expect(401);
  });

  it("should reject access for a non-administrator", async () => {
    await api
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should allow an administrator to access all users", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const response = await api
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });
});