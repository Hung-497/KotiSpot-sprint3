const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Inquiry = require("../models/inquiryModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let owner;
let sender;
let stranger;
let ownerToken;
let senderToken;
let strangerToken;
let property;

const tokenFor = (user) =>
  jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "3d" });

const inquiryData = {
  name: "Sender",
  email: "sender@example.com",
  message: "Is this still available?",
};

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Property.deleteMany({});
  await Inquiry.deleteMany({});

  owner = await User.create({
    email: "owner@example.com",
    role: "seller",
    verifiedAt: new Date(),
  });
  sender = await User.create({ email: "sender@example.com", role: "buyer" });
  stranger = await User.create({
    email: "stranger@example.com",
    role: "buyer",
  });

  ownerToken = tokenFor(owner);
  senderToken = tokenFor(sender);
  strangerToken = tokenFor(stranger);

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
    buildingYear: 2000,
    size: 70,
    status: "active",
    moderation: { status: "approved" },
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

const sendInquiry = (token = senderToken, data = inquiryData) => {
  const request = api.post(`/api/inquiries/${property._id}`);

  if (token) {
    request.set("Authorization", `Bearer ${token}`);
  }

  return request.send(data);
};

const reply = (inquiryId, token, text) =>
  api
    .post(`/api/inquiries/${inquiryId}/replies`)
    .set("Authorization", `Bearer ${token}`)
    .send({ text });

const deleteFor = (inquiryId, token) =>
  api
    .delete(`/api/inquiries/${inquiryId}`)
    .set("Authorization", `Bearer ${token}`);

const getMine = (token) =>
  api.get("/api/inquiries/mine").set("Authorization", `Bearer ${token}`);

const getSent = (token) =>
  api.get("/api/inquiries/sent").set("Authorization", `Bearer ${token}`);

describe("POST /api/inquiries/:propertyId", () => {
  it("should create an inquiry for the listing owner from a logged-in user", async () => {
    const response = await sendInquiry().expect(201);

    expect(response.body.owner).toBe(owner._id.toString());
    expect(response.body.sender).toBe(sender._id.toString());
    expect(response.body.propertyId).toBe(property._id.toString());
    expect(response.body.replies).toEqual([]);
  });

  it("should let a guest send an inquiry without a sender", async () => {
    const response = await sendInquiry(null).expect(201);

    expect(response.body.owner).toBe(owner._id.toString());
    expect(response.body.sender).toBeUndefined();
  });

  it("should treat an invalid token as a guest", async () => {
    const response = await sendInquiry("not-a-token").expect(201);

    expect(response.body.sender).toBeUndefined();
  });

  it("should not let the client choose the owner or sender", async () => {
    const response = await sendInquiry(senderToken, {
      ...inquiryData,
      owner: stranger._id.toString(),
      sender: stranger._id.toString(),
    }).expect(201);

    expect(response.body.owner).toBe(owner._id.toString());
    expect(response.body.sender).toBe(sender._id.toString());
  });

  it.each([
    ["the name is missing", { ...inquiryData, name: undefined }],
    ["the email is missing", { ...inquiryData, email: undefined }],
    ["the message is blank", { ...inquiryData, message: "   " }],
    ["the message is not text", { ...inquiryData, message: 123 }],
  ])("should reject the inquiry when %s", async (_, data) => {
    await sendInquiry(senderToken, data).expect(400);

    expect(await Inquiry.countDocuments()).toBe(0);
  });

  it("should reject an invalid email or a too long message", async () => {
    await sendInquiry(senderToken, {
      ...inquiryData,
      email: "not-an-email",
    }).expect(400);
    await sendInquiry(senderToken, {
      ...inquiryData,
      message: "a".repeat(1001),
    }).expect(400);

    expect(await Inquiry.countDocuments()).toBe(0);
  });

  it("should return 400 for an invalid property ID", async () => {
    await api.post("/api/inquiries/not-an-id").send(inquiryData).expect(400);
  });

  it("should return 404 for a property that does not exist", async () => {
    await api
      .post(`/api/inquiries/${new mongoose.Types.ObjectId()}`)
      .send(inquiryData)
      .expect(404);
  });

  it.each([
    ["inactive", { status: "inactive" }],
    ["sold", { status: "sold" }],
    ["waiting for moderation", { "moderation.status": "unreviewed" }],
    ["removed by moderation", { "moderation.status": "removed" }],
  ])(
    "should not accept an inquiry for a listing that is %s",
    async (_, change) => {
      await Property.updateOne({ _id: property._id }, { $set: change });

      await sendInquiry().expect(404);

      expect(await Inquiry.countDocuments()).toBe(0);
    },
  );
  it("should accept an inquiry for a flagged listing that is still public", async () => {
    await Property.updateOne(
      { _id: property._id },
      { $set: { "moderation.status": "flagged" } },
    );

    await sendInquiry().expect(201);

    expect(await Inquiry.countDocuments()).toBe(1);
  });
});

describe("GET /api/inquiries/mine and /sent", () => {
  it("should require authentication", async () => {
    await api.get("/api/inquiries/mine").expect(401);
    await api.get("/api/inquiries/sent").expect(401);
  });

  it("should show an inquiry only to the owner of the listing", async () => {
    await sendInquiry().expect(201);

    const mine = await getMine(ownerToken).expect(200);
    expect(mine.body).toHaveLength(1);
    expect(mine.body[0].propertyId.title).toBe("Test apartment");

    expect((await getMine(senderToken).expect(200)).body).toHaveLength(0);
    expect((await getMine(strangerToken).expect(200)).body).toHaveLength(0);
  });

  it("should show a sent inquiry to the sender only after it has a reply", async () => {
    const { body: inquiry } = await sendInquiry().expect(201);

    expect((await getSent(senderToken).expect(200)).body).toHaveLength(0);

    await reply(inquiry._id, ownerToken, "Yes it is.").expect(201);

    const sent = await getSent(senderToken).expect(200);
    expect(sent.body).toHaveLength(1);
    expect(sent.body[0].replies[0].text).toBe("Yes it is.");

    expect((await getSent(strangerToken).expect(200)).body).toHaveLength(0);
  });

  it("should still return the inquiry when its listing was deleted", async () => {
    await sendInquiry().expect(201);
    await Property.deleteOne({ _id: property._id });

    const mine = await getMine(ownerToken).expect(200);

    expect(mine.body).toHaveLength(1);
    expect(mine.body[0].propertyId).toBeNull();
  });

  it("should expose unavailable listing state for an existing inquiry", async () => {
    await sendInquiry().expect(201);

    await Property.updateOne(
      { _id: property._id },
      { $set: { status: "inactive" } },
    );

    const response = await getMine(ownerToken).expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].propertyId.title).toBe("Test apartment");
    expect(response.body[0].propertyId.status).toBe("inactive");
  });
});

describe("POST /api/inquiries/:inquiryId/replies", () => {
  let inquiry;

  beforeEach(async () => {
    inquiry = (await sendInquiry().expect(201)).body;
  });

  it("should let the owner and the sender reply back and forth", async () => {
    await reply(inquiry._id, ownerToken, "Yes it is.").expect(201);
    const response = await reply(
      inquiry._id,
      senderToken,
      "Can I visit?",
    ).expect(201);

    expect(response.body.replies.map((saved) => saved.from)).toEqual([
      "owner",
      "sender",
    ]);
    expect(response.body.replies[1].text).toBe("Can I visit?");
  });

  it("should require authentication", async () => {
    await api
      .post(`/api/inquiries/${inquiry._id}/replies`)
      .send({ text: "Hello" })
      .expect(401);
  });

  it("should not let an unrelated user reply", async () => {
    await reply(inquiry._id, strangerToken, "Hello").expect(403);

    const saved = await Inquiry.findById(inquiry._id);
    expect(saved.replies).toHaveLength(0);
  });

  it("should reject an empty or too long reply", async () => {
    await reply(inquiry._id, ownerToken, "   ").expect(400);
    await reply(inquiry._id, ownerToken, undefined).expect(400);
    await reply(inquiry._id, ownerToken, "a".repeat(1001)).expect(400);

    const saved = await Inquiry.findById(inquiry._id);
    expect(saved.replies).toHaveLength(0);
  });

  it("should return 404 or 400 for a missing or invalid inquiry", async () => {
    await reply(new mongoose.Types.ObjectId(), ownerToken, "Hello").expect(404);
    await reply("not-an-id", ownerToken, "Hello").expect(400);
  });

  it("should bring a deleted conversation back for the other person", async () => {
    await reply(inquiry._id, ownerToken, "Yes it is.").expect(201);
    await deleteFor(inquiry._id, senderToken).expect(200);
    expect((await getSent(senderToken).expect(200)).body).toHaveLength(0);

    await reply(inquiry._id, ownerToken, "Still interested?").expect(201);

    expect((await getSent(senderToken).expect(200)).body).toHaveLength(1);
  });
});

describe("DELETE /api/inquiries/:inquiryId", () => {
  let inquiry;

  beforeEach(async () => {
    inquiry = (await sendInquiry().expect(201)).body;
    await reply(inquiry._id, ownerToken, "Yes it is.").expect(201);
  });

  it("should hide it only for the owner who deleted it", async () => {
    await deleteFor(inquiry._id, ownerToken).expect(200);

    expect((await getMine(ownerToken).expect(200)).body).toHaveLength(0);
    expect((await getSent(senderToken).expect(200)).body).toHaveLength(1);

    // It is hidden, not removed from the database
    expect(await Inquiry.findById(inquiry._id)).not.toBeNull();
  });

  it("should hide it only for the sender who deleted it", async () => {
    await deleteFor(inquiry._id, senderToken).expect(200);

    expect((await getSent(senderToken).expect(200)).body).toHaveLength(0);
    expect((await getMine(ownerToken).expect(200)).body).toHaveLength(1);
  });

  it("should require authentication", async () => {
    await api.delete(`/api/inquiries/${inquiry._id}`).expect(401);
  });

  it("should not let an unrelated user delete it", async () => {
    await deleteFor(inquiry._id, strangerToken).expect(403);

    const saved = await Inquiry.findById(inquiry._id);
    expect(saved.deletedByOwner).toBe(false);
    expect(saved.deletedBySender).toBe(false);
  });

  it("should return 404 or 400 for a missing or invalid inquiry", async () => {
    await deleteFor(new mongoose.Types.ObjectId(), ownerToken).expect(404);
    await deleteFor("not-an-id", ownerToken).expect(400);
  });
});
