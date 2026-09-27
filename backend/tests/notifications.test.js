const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Inquiry = require("../models/inquiryModel");
const ContactMessage = require("../models/contactMessageModel");
const Verification = require("../models/verificationModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let owner;
let sender;
let stranger;
let admin;
let ownerToken;
let senderToken;
let strangerToken;
let adminToken;
let property;

const tokenFor = (user) =>
  jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "3d" });

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Property.deleteMany({});
  await Inquiry.deleteMany({});
  await ContactMessage.deleteMany({});
  await Verification.deleteMany({});

  owner = await User.create({
    email: "owner@example.com",
    role: "seller",
    verifiedAt: new Date(),
  });
  sender = await User.create({ email: "sender@example.com", role: "buyer" });
  stranger = await User.create({ email: "stranger@example.com", role: "buyer" });
  admin = await User.create({ email: "admin@example.com", role: "administrator" });

  ownerToken = tokenFor(owner);
  senderToken = tokenFor(sender);
  strangerToken = tokenFor(stranger);
  adminToken = tokenFor(admin);

  property = await Property.create({
    owner: owner._id,
    title: "Test apartment",
    description: "Test property",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 250000,
    currency: "EUR",
    city: "Helsinki",
    address: "Testikatu 1",
    postalCode: "00100",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    size: 70,
    status: "active",
    moderation: {
      status: "approved",
    },
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

const sendInquiry = () =>
  api
    .post(`/api/inquiries/${property._id}`)
    .set("Authorization", `Bearer ${senderToken}`)
    .send({
      name: "Sender",
      email: "sender@example.com",
      message: "Is this still available?",
    })
    .expect(201);

const getMine = (token) =>
  api.get("/api/inquiries/mine").set("Authorization", `Bearer ${token}`);

const getSent = (token) =>
  api.get("/api/inquiries/sent").set("Authorization", `Bearer ${token}`);

describe("Inquiry read state", () => {
  it("should be unread for the owner when a new inquiry arrives", async () => {
    await sendInquiry();

    const response = await getMine(ownerToken).expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].readByOwner).toBe(false);
  });

  it("should stay read after the owner marks it as read and fetches again", async () => {
    const { body: inquiry } = await sendInquiry();

    await api
      .patch(`/api/inquiries/${inquiry._id}/read`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(200);

    const response = await getMine(ownerToken).expect(200);

    expect(response.body[0].readByOwner).toBe(true);
  });

  it("should reject marking as read without authentication", async () => {
    const { body: inquiry } = await sendInquiry();

    await api.patch(`/api/inquiries/${inquiry._id}/read`).expect(401);
  });

  it("should not let an unrelated user mark it as read", async () => {
    const { body: inquiry } = await sendInquiry();

    await api
      .patch(`/api/inquiries/${inquiry._id}/read`)
      .set("Authorization", `Bearer ${strangerToken}`)
      .expect(403);

    const saved = await Inquiry.findById(inquiry._id);
    expect(saved.readByOwner).toBe(false);
  });

  it("should return 404 for an inquiry that does not exist", async () => {
    await api
      .patch(`/api/inquiries/${new mongoose.Types.ObjectId()}/read`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(404);
  });

  it("should return 400 for an invalid inquiry ID", async () => {
    await api
      .patch("/api/inquiries/not-an-id/read")
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(400);
  });

  it("should make a reply unread for the other person only", async () => {
    const { body: inquiry } = await sendInquiry();

    await api
      .post(`/api/inquiries/${inquiry._id}/replies`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ text: "Yes it is." })
      .expect(201);

    const sent = await getSent(senderToken).expect(200);
    expect(sent.body[0].readBySender).toBe(false);

    const mine = await getMine(ownerToken).expect(200);
    expect(mine.body[0].readByOwner).toBe(true);

    await api
      .patch(`/api/inquiries/${inquiry._id}/read`)
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(200);

    const sentAgain = await getSent(senderToken).expect(200);
    expect(sentAgain.body[0].readBySender).toBe(true);

    // A new message from the sender makes it unread for the owner again
    await api
      .post(`/api/inquiries/${inquiry._id}/replies`)
      .set("Authorization", `Bearer ${senderToken}`)
      .send({ text: "Can I come see it?" })
      .expect(201);

    const mineAgain = await getMine(ownerToken).expect(200);
    expect(mineAgain.body[0].readByOwner).toBe(false);
  });
});

describe("Contact message read state", () => {
  let contactMessage;

  beforeEach(async () => {
    const response = await api
      .post("/api/contact-messages")
      .set("Authorization", `Bearer ${senderToken}`)
      .send({
        fullName: "Sender",
        email: "sender@example.com",
        subject: "Help",
        message: "I need help.",
      })
      .expect(201);

    contactMessage = response.body;
  });

  it("should be unread for the admin until the admin marks it as read", async () => {
    const before = await api
      .get("/api/contact-messages")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(before.body[0].readByAdmin).toBe(false);

    await api
      .patch(`/api/contact-messages/${contactMessage._id}/admin/read`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const after = await api
      .get("/api/contact-messages")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(after.body[0].readByAdmin).toBe(true);
  });

  it("should not let a non-admin use the admin mark-as-read route", async () => {
    await api
      .patch(`/api/contact-messages/${contactMessage._id}/admin/read`)
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(403);
  });

  it("should make an admin reply unread for the user until they mark it as read", async () => {
    await api
      .post(`/api/contact-messages/${contactMessage._id}/replies`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ text: "How can we help?" })
      .expect(201);

    const before = await api
      .get("/api/contact-messages/mine")
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(200);
    expect(before.body[0].readByUser).toBe(false);

    await api
      .patch(`/api/contact-messages/${contactMessage._id}/read`)
      .set("Authorization", `Bearer ${strangerToken}`)
      .expect(403);

    await api
      .patch(`/api/contact-messages/${contactMessage._id}/read`)
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(200);

    const after = await api
      .get("/api/contact-messages/mine")
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(200);
    expect(after.body[0].readByUser).toBe(true);
  });
});

describe("Verification application read state", () => {
  let application;

  beforeEach(async () => {
    application = await Verification.create({
      user: sender._id,
      role: "seller",
      fullName: "Sender",
      phone: "0401234567",
      email: "sender@example.com",
      bio: "Verification request",
      idDocument: "id-document.pdf",
    });
  });

  it("should be unread until the admin marks it as read", async () => {
    const before = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(before.body[0].readByAdmin).toBe(false);

    await api
      .patch(`/api/verifications/${application._id}/read`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const after = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(after.body[0].readByAdmin).toBe(true);
  });

  it("should be marked as read when the admin reviews it", async () => {
    await api
      .patch(`/api/verifications/${application._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved", reviewReason: "Documents verified" })
      .expect(200);

    const saved = await Verification.findById(application._id);
    expect(saved.readByAdmin).toBe(true);
  });

  it("should not let the admin delete a pending application", async () => {
    await api
      .delete(`/api/verifications/${application._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(409);

    const saved = await Verification.findById(application._id);
    expect(saved.deletedByAdmin).toBe(false);
  });

  it("should let the admin delete an application after reviewing it", async () => {
    await api
      .patch(`/api/verifications/${application._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "rejected", rejectionReason: "Blurry ID" })
      .expect(200);

    await api
      .delete(`/api/verifications/${application._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const response = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toHaveLength(0);
  });

  it("should still list a pending application that was hidden earlier", async () => {
    // e.g. deleted before pending applications were protected
    await Verification.updateOne(
      { _id: application._id },
      { $set: { deletedByAdmin: true } },
    );

    const response = await api
      .get("/api/verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toHaveLength(1);

    const filtered = await api
      .get("/api/verifications?status=pending")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(filtered.body).toHaveLength(1);
  });

  it("should not let a non-admin mark it as read", async () => {
    await api
      .patch(`/api/verifications/${application._id}/read`)
      .set("Authorization", `Bearer ${senderToken}`)
      .expect(403);
  });
});
