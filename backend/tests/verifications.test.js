const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const Verification = require("../models/verificationModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let user;
let token;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Verification.deleteMany({});

  user = await User.create({
    email: "buyer@example.com",
    role: "buyer",
  });

  token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "3d" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

const verificationData = {
  role: "seller",
  fullName: "John Doe",
  phone: "1234567890",
  email: "buyer@example.com",
  bio: "I want to become a verified seller.",
  idDocument: "id-document.pdf",
};

describe("POST /api/verifications", () => {
  it("should reject verification creation without authentication", async () => {
    await api.post("/api/verifications").send(verificationData).expect(401);
  });

  it("should create verification for the authenticated user", async () => {
    const response = await api
      .post("/api/verifications")
      .set("Authorization", `Bearer ${token}`)
      .send(verificationData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user).toBe(user._id.toString());
    expect(response.body.role).toBe("seller");
    expect(response.body.status).toBe("pending");
  });
});

describe("GET /api/verifications/me", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/verifications/me").expect(401);
  });

  it("should return the authenticated user's latest verification", async () => {
    await Verification.create({
      user: user._id,
      role: "seller",
      fullName: "Test Seller",
      phone: "0401234567",
      email: "buyer@example.com",
      bio: "Verification request",
      idDocument: "id-document.pdf",
    });

    const response = await api
      .get("/api/verifications/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user).toBe(user._id.toString());
    expect(response.body.role).toBe("seller");
    expect(response.body.status).toBe("pending");
  });
});

describe("GET /api/verifications", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/verifications").expect(401);
  });

  it("should reject access for a non-administrator", async () => {
    await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should allow an administrator to access verification applications", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    await Verification.create({
      user: user._id,
      role: "seller",
      fullName: "Test Seller",
      phone: "0401234567",
      email: "buyer@example.com",
      bio: "Verification request",
      idDocument: "id-document.pdf",
    });

    const response = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].user).toBe(user._id.toString());
  });
});

describe("PATCH /api/verifications/:applicationId", () => {
  it("should use the authenticated administrator as reviewedBy", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const verification = await Verification.create({
      user: user._id,
      role: "seller",
      fullName: "Test Seller",
      phone: "0401234567",
      email: "buyer@example.com",
      bio: "Verification request",
      idDocument: "id-document.pdf",
    });

    const response = await api
      .patch(`/api/verifications/${verification._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "rejected",
        reviewedBy: user._id.toString(),
        rejectionReason: "Documents could not be verified",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.status).toBe("rejected");
    expect(response.body.reviewedBy).toBe(administrator._id.toString());
  });

  it("should update the verified user's role and verifiedAt when approved", async () => {
    const administrator = await User.create({
      email: "approvaladmin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const verification = await Verification.create({
      user: user._id,
      role: "seller",
      fullName: "Test Seller",
      phone: "0401234567",
      email: "buyer@example.com",
      bio: "Verification request",
      idDocument: "id-document.pdf",
    });

    await api
      .patch(`/api/verifications/${verification._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "approved",
      })
      .expect(200);

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.role).toBe("seller");
    expect(updatedUser.verifiedAt).toBeInstanceOf(Date);
  });
});
