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
        reviewReason: "Documents verified",
      })
      .expect(200);

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.role).toBe("seller");
    expect(updatedUser.verifiedAt).toBeInstanceOf(Date);
  });

  describe("review reason", () => {
    let adminToken;
    let verification;

    beforeEach(async () => {
      const administrator = await User.create({
        email: "reasonadmin@example.com",
        role: "administrator",
      });

      adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
        expiresIn: "3d",
      });

      verification = await Verification.create({
        user: user._id,
        role: "seller",
        fullName: "Test Seller",
        phone: "0401234567",
        email: "buyer@example.com",
        bio: "Verification request",
        idDocument: "id-document.pdf",
      });
    });

    it("should reject an approval without a reason and leave it pending", async () => {
      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved" })
        .expect(400);

      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved", reviewReason: "   " })
        .expect(400);

      const saved = await Verification.findById(verification._id);
      const savedUser = await User.findById(user._id);

      expect(saved.status).toBe("pending");
      expect(savedUser.role).toBe("buyer");
    });

    it("should reject a rejection without a reason", async () => {
      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "rejected" })
        .expect(400);
    });

    it("should reject a reason longer than 500 characters", async () => {
      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved", reviewReason: "a".repeat(501) })
        .expect(400);
    });

    it("should store the reason when approving", async () => {
      const response = await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved", reviewReason: "  ID matches the account  " })
        .expect(200);

      expect(response.body.reviewReason).toBe("ID matches the account");
      expect(response.body.rejectionReason).toBeUndefined();

      const saved = await Verification.findById(verification._id);
      expect(saved.reviewReason).toBe("ID matches the account");
    });

    it("should store the reason when rejecting", async () => {
      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "rejected", reviewReason: "ID is unreadable" })
        .expect(200);

      const saved = await Verification.findById(verification._id);
      expect(saved.reviewReason).toBe("ID is unreadable");
      expect(saved.rejectionReason).toBe("ID is unreadable");
    });

    it("should still accept the reason as rejectionReason from older clients", async () => {
      await api
        .patch(`/api/verifications/${verification._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "rejected", rejectionReason: "Documents missing" })
        .expect(200);

      const saved = await Verification.findById(verification._id);
      expect(saved.reviewReason).toBe("Documents missing");
    });
  });
});

const agentData = {
  ...verificationData,
  role: "agent",
  licenseNumber: "LKV-123",
  licenseDocument: "license-document.pdf",
};

const createAdmin = async (email = "reviewer@example.com") => {
  const administrator = await User.create({ email, role: "administrator" });

  return jwt.sign({ _id: administrator._id }, JWT_SECRET, { expiresIn: "3d" });
};

const createApplication = (overrides = {}) =>
  Verification.create({
    user: user._id,
    role: "seller",
    fullName: "Test Seller",
    phone: "0401234567",
    email: "buyer@example.com",
    bio: "Verification request",
    idDocument: "id-document.pdf",
    ...overrides,
  });

const apply = (data, authToken = token) =>
  api
    .post("/api/verifications")
    .set("Authorization", `Bearer ${authToken}`)
    .send(data);

describe("POST /api/verifications rules", () => {
  it("should not let the client choose the user or the status", async () => {
    const otherUser = await User.create({ email: "other@example.com" });

    const response = await apply({
      ...verificationData,
      user: otherUser._id.toString(),
      status: "approved",
    }).expect(201);

    expect(response.body.user).toBe(user._id.toString());
    expect(response.body.status).toBe("pending");
  });

  it("should reject a second application while one is pending", async () => {
    await apply(verificationData).expect(201);
    await apply(agentData).expect(409);

    expect(await Verification.countDocuments()).toBe(1);
  });

  it("should allow a new application after the last one was rejected", async () => {
    await createApplication({ status: "rejected" });

    await apply(verificationData).expect(201);
  });

  it("should reject an unknown role", async () => {
    await apply({ ...verificationData, role: "administrator" }).expect(400);
  });

  it("should require an ID document", async () => {
    await apply({ ...verificationData, idDocument: "  " }).expect(400);
  });

  it("should require a licence document for agents only", async () => {
    await apply({ ...agentData, licenseDocument: undefined }).expect(400);

    const response = await apply({
      ...verificationData,
      licenseDocument: "ignored.pdf",
    }).expect(201);
    expect(response.body.licenseDocument).toBeUndefined();
  });

  it("should reject missing required fields", async () => {
    await apply({ ...verificationData, phone: undefined }).expect(400);

    expect(await Verification.countDocuments()).toBe(0);
  });

  it("should only let a seller apply to become an agent", async () => {
    await User.updateOne(
      { _id: user._id },
      { role: "seller", verifiedAt: new Date() },
    );

    await apply(verificationData).expect(400);
    await apply(agentData).expect(201);
  });

  it("should not let agents or administrators apply", async () => {
    await User.updateOne({ _id: user._id }, { role: "agent" });
    await apply(agentData).expect(400);

    const adminToken = await createAdmin();
    await apply(agentData, adminToken).expect(400);
  });
});

describe("GET /api/verifications/me without an application", () => {
  it("should return 404", async () => {
    await api
      .get("/api/verifications/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  it("should never return another user's application", async () => {
    const otherUser = await User.create({ email: "other@example.com" });
    await createApplication({ user: otherUser._id });

    await api
      .get("/api/verifications/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});

describe("GET /api/verifications status filter", () => {
  it("should filter by status and reject an unknown status", async () => {
    const adminToken = await createAdmin();
    await createApplication();
    await createApplication({ status: "approved" });

    const response = await api
      .get("/api/verifications?status=approved")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe("approved");

    await api
      .get("/api/verifications?status=deleted")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);
  });
});

describe("PATCH /api/verifications/:applicationId rules", () => {
  let adminToken;
  let application;

  beforeEach(async () => {
    adminToken = await createAdmin();
    application = await createApplication();
  });

  const review = (id, body, authToken = adminToken) =>
    api
      .patch(`/api/verifications/${id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(body);

  it("should require an administrator", async () => {
    await api
      .patch(`/api/verifications/${application._id}`)
      .send({ status: "approved", reviewReason: "OK" })
      .expect(401);

    await review(
      application._id,
      { status: "approved", reviewReason: "OK" },
      token,
    ).expect(403);

    const savedUser = await User.findById(user._id);
    expect(savedUser.role).toBe("buyer");
  });

  it("should reject an unknown status", async () => {
    await review(application._id, {
      status: "pending",
      reviewReason: "OK",
    }).expect(400);
  });

  it("should not change the user's role when rejected", async () => {
    await review(application._id, {
      status: "rejected",
      reviewReason: "ID is unreadable",
    }).expect(200);

    const savedUser = await User.findById(user._id);
    expect(savedUser.role).toBe("buyer");
    expect(savedUser.verifiedAt).toBeUndefined();
  });

  it("should not review the same application twice", async () => {
    await review(application._id, {
      status: "rejected",
      reviewReason: "No",
    }).expect(200);

    await review(application._id, {
      status: "approved",
      reviewReason: "Yes",
    }).expect(409);

    const savedUser = await User.findById(user._id);
    expect(savedUser.role).toBe("buyer");
  });

  it("should return 404 or 400 for a missing or invalid application", async () => {
    await review(new mongoose.Types.ObjectId(), {
      status: "approved",
      reviewReason: "OK",
    }).expect(404);

    await review("not-an-id", {
      status: "approved",
      reviewReason: "OK",
    }).expect(400);
  });
});

describe("DELETE /api/verifications/:applicationId", () => {
  let adminToken;
  let application;

  beforeEach(async () => {
    adminToken = await createAdmin();
    application = await createApplication({ status: "approved" });
  });

  const remove = (id, authToken = adminToken) =>
    api
      .delete(`/api/verifications/${id}`)
      .set("Authorization", `Bearer ${authToken}`);

  it("should hide a reviewed application from the admin list only", async () => {
    await remove(application._id).expect(200);

    const list = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(list.body).toHaveLength(0);

    // The applicant still sees their own application
    await api
      .get("/api/verifications/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should require an administrator", async () => {
    await api.delete(`/api/verifications/${application._id}`).expect(401);
    await remove(application._id, token).expect(403);

    const saved = await Verification.findById(application._id);
    expect(saved.deletedByAdmin).toBe(false);
  });

  it("should return 404 or 400 for a missing or invalid application", async () => {
    await remove(new mongoose.Types.ObjectId()).expect(404);
    await remove("not-an-id").expect(400);
  });
});

describe("PATCH /api/verifications/:applicationId/read", () => {
  it("should return 404 or 400 for a missing or invalid application", async () => {
    const adminToken = await createAdmin();

    await api
      .patch(`/api/verifications/${new mongoose.Types.ObjectId()}/read`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);

    await api
      .patch("/api/verifications/not-an-id/read")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);
  });
});
