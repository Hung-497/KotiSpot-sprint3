const supertest = require("supertest");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const AuthCode = require("../models/authCodeModel");
const { OTP_SECRET, JWT_SECRET } = require("../config/config");
const User = require("../models/userModel");

const api = supertest(app);

const hashCode = (email, code) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");
};

const createAuthCode = async ({
  email = "test@example.com",
  code = "123456",
  attempts = 0,
  expiresAt = new Date(Date.now() + 10 * 60 * 1000),
} = {}) => {
  return AuthCode.create({
    email,
    codeHash: hashCode(email, code),
    attempts,
    expiresAt,
  });
};

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await AuthCode.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await AuthCode.deleteMany({});
  await mongoose.connection.close();
});

describe("POST /api/account/request-code", () => {
  it("should create a hashed code for a valid email", async () => {
    const response = await api
      .post("/api/account/request-code")
      .send({ email: " Test@Example.com" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("Login code sent");

    const authCode = await AuthCode.findOne({ email: "test@example.com" });

    expect(authCode).not.toBeNull();
    expect(authCode.codeHash).toMatch(/^[a-f0-9]{64}$/); // Check if it's a valid SHA-256 hash
    expect(authCode.attempts).toBe(0);
    expect(authCode.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(authCode.toObject()).not.toHaveProperty("code"); // Ensure the code is not stored in plaintext
  });

  it("should reject an invalid email", async () => {
    await api
      .post("/api/account/request-code")
      .send({ email: "not-an-email" })
      .expect(400);
    const authCodes = await AuthCode.find({});
    expect(authCodes).toHaveLength(0); // Ensure no auth code is created for invalid email
  });

  it("should reject an immediate resend", async () => {
    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com" })
      .expect(200);

    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com" })
      .expect(429);
  });
  it("should reject too many code requests in the same window", async () => {
    await AuthCode.create({
      email: "test@example.com",
      codeHash: hashCode("test@example.com", "123456"),
      attempts: 0,
      requestCount: 5,
      requestWindowStartedAt: new Date(),
      lastSentAt: new Date(Date.now() - 61 * 1000),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com" })
      .expect(429);
  });

  it("should allow a new request after the request window expires", async () => {
    await AuthCode.create({
      email: "test@example.com",
      codeHash: hashCode("test@example.com", "123456"),
      attempts: 0,
      requestCount: 5,
      requestWindowStartedAt: new Date(Date.now() - 11 * 60 * 1000),
      lastSentAt: new Date(Date.now() - 61 * 1000),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com" })
      .expect(200);

    const authCode = await AuthCode.findOne({
      email: "test@example.com",
    });

    expect(authCode.requestCount).toBe(1);
  });
});

describe("POST /api/account/verify-code", () => {
  it("should verify a correct login code and create a new user", async () => {
    await createAuthCode();

    const response = await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "123456" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("Login code verified");
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.user.role).toBe("buyer");
    expect(response.body.token).toBeDefined();

    const decodedToken = jwt.verify(response.body.token, JWT_SECRET);

    expect(decodedToken._id).toBe(response.body.user._id);
    expect(decodedToken.exp).toBeGreaterThan(decodedToken.iat); // Ensure the token has an expiration time

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();
  });

  it("should use an existing user instead of creating another one", async () => {
    await User.create({ email: "test@example.com" });

    await createAuthCode();

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "123456" })
      .expect(200);

    const user = await User.find({ email: "test@example.com" });
    expect(user).toHaveLength(1); // Ensure no duplicate user is created
  });

  it("should reject an incorrect login code and increment attempts", async () => {
    await createAuthCode();

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "654321" })
      .expect(400);

    const authCode = await AuthCode.findOne({ email: "test@example.com" });
    expect(authCode.attempts).toBe(1);
  });

  it("should reject an expired login code", async () => {
    await createAuthCode({ expiresAt: new Date(Date.now() - 1000) });

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "654321" })
      .expect(400);
  });

  it("should reject after too many attempts", async () => {
    await createAuthCode({ attempts: 4 });

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "654321" })
      .expect(429);

    const authCode = await AuthCode.findOne({ email: "test@example.com" });
    expect(authCode).toBeNull(); // Ensure the auth code is deleted after too many attempts
  });

  it("should allow a login code to be used only once", async () => {
    await createAuthCode();

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "123456" })
      .expect(200);

    await api
      .post("/api/account/verify-code")
      .send({ email: "test@example.com", code: "123456" })
      .expect(400);
  });
  it("should return a JWT that cannot be verified with the wrong secret", async () => {
    await createAuthCode();

    const response = await api
      .post("/api/account/verify-code")
      .send({
        email: "test@example.com",
        code: "123456",
      })
      .expect(200);

    expect(() => {
      jwt.verify(response.body.token, "wrong-secret");
    }).toThrow();
  });
});

describe("GET /api/account/me", () => {
  it("should reject a request without a token", async () => {
    await api
      .get("/api/account/me")
      .expect(401);
  });

  it("should reject a request with an invalid token", async () => {
    await api
      .get("/api/account/me")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);
  });

  it("should return the authenticated user with a valid token", async () => {
    const user = await User.create({
      email: "test@example.com",
    });

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: "3d" },
    );

    const response = await api
      .get("/api/account/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user._id).toBe(user._id.toString());
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.user.role).toBe("buyer");
  });
});
describe("Login only works for emails that signed up first", () => {
  it("should not send a login code to an email without an account", async () => {
    const response = await api
      .post("/api/account/request-code")
      .send({ email: "new@example.com", mode: "login" })
      .expect(404);

    expect(response.body.message).toBe(
      "No account found with this email. Please sign up first.",
    );

    const authCode = await AuthCode.findOne({ email: "new@example.com" });
    expect(authCode).toBeNull();
  });

  it("should send a login code to an email that has an account", async () => {
    await User.create({ email: "test@example.com" });

    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com", mode: "login" })
      .expect(200);
  });

  it("should not create a user when logging in with an unknown email", async () => {
    await createAuthCode({ email: "new@example.com" });

    await api
      .post("/api/account/verify-code")
      .send({ email: "new@example.com", code: "123456", mode: "login" })
      .expect(404);

    const user = await User.findOne({ email: "new@example.com" });
    expect(user).toBeNull();
  });

  it("should not let someone sign up with an email that already has an account", async () => {
    await User.create({ email: "test@example.com" });

    await api
      .post("/api/account/request-code")
      .send({ email: "test@example.com", mode: "register" })
      .expect(409);
  });

  it("should create the user when signing up with a new email", async () => {
    await createAuthCode({ email: "new@example.com" });

    await api
      .post("/api/account/verify-code")
      .send({ email: "new@example.com", code: "123456", mode: "register" })
      .expect(200);

    const user = await User.findOne({ email: "new@example.com" });
    expect(user).not.toBeNull();
  });
});
