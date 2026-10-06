const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const ContactMessage = require("../models/contactMessageModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let user;
let stranger;
let admin;
let userToken;
let strangerToken;
let adminToken;

const tokenFor = (account) =>
  jwt.sign({ _id: account._id }, JWT_SECRET, { expiresIn: "3d" });

const messageData = {
  fullName: "Test User",
  email: "user@example.com",
  subject: "Help",
  message: "I need help with my account.",
};

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await ContactMessage.deleteMany({});

  user = await User.create({ email: "user@example.com", role: "buyer" });
  stranger = await User.create({ email: "stranger@example.com", role: "buyer" });
  admin = await User.create({ email: "admin@example.com", role: "administrator" });

  userToken = tokenFor(user);
  strangerToken = tokenFor(stranger);
  adminToken = tokenFor(admin);
});

afterAll(async () => {
  await mongoose.connection.close();
});

const sendMessage = (token = userToken, data = messageData) => {
  const request = api.post("/api/contact-messages");

  if (token) {
    request.set("Authorization", `Bearer ${token}`);
  }

  return request.send(data);
};

const reply = (messageId, token, text) =>
  api
    .post(`/api/contact-messages/${messageId}/replies`)
    .set("Authorization", `Bearer ${token}`)
    .send({ text });

const getAdminList = (token = adminToken) =>
  api.get("/api/contact-messages").set("Authorization", `Bearer ${token}`);

const getMine = (token = userToken) =>
  api.get("/api/contact-messages/mine").set("Authorization", `Bearer ${token}`);

describe("POST /api/contact-messages", () => {
  it("should save a message from a logged-in user", async () => {
    const response = await sendMessage().expect(201);

    expect(response.body.user).toBe(user._id.toString());
    expect(response.body.subject).toBe("Help");
    expect(response.body.submittedAt).toBeDefined();
  });

  it("should save a message from a guest without a user", async () => {
    const response = await sendMessage(null).expect(201);

    expect(response.body.user).toBeUndefined();
  });

  it("should not let the client choose the user", async () => {
    const response = await sendMessage(userToken, {
      ...messageData,
      user: stranger._id.toString(),
    }).expect(201);

    expect(response.body.user).toBe(user._id.toString());
  });

  it.each([
    ["the name is missing", { ...messageData, fullName: undefined }],
    ["the subject is blank", { ...messageData, subject: "  " }],
    ["the message is missing", { ...messageData, message: undefined }],
    ["the email is invalid", { ...messageData, email: "not-an-email" }],
    ["the message is too long", { ...messageData, message: "a".repeat(1001) }],
  ])("should reject the message when %s", async (_, data) => {
    await sendMessage(userToken, data).expect(400);

    expect(await ContactMessage.countDocuments()).toBe(0);
  });
});

describe("GET /api/contact-messages (admin)", () => {
  it("should require an administrator", async () => {
    await api.get("/api/contact-messages").expect(401);
    await getAdminList(userToken).expect(403);
  });

  it("should return all messages, newest first, including guest ones", async () => {
    await sendMessage(null, { ...messageData, subject: "First" }).expect(201);
    await sendMessage(userToken, { ...messageData, subject: "Second" }).expect(201);

    const response = await getAdminList().expect(200);

    expect(response.body.map((message) => message.subject)).toEqual([
      "Second",
      "First",
    ]);
  });
});

describe("GET /api/contact-messages/mine", () => {
  it("should require authentication", async () => {
    await api.get("/api/contact-messages/mine").expect(401);
  });

  it("should only show my own messages once they have a reply", async () => {
    const { body: message } = await sendMessage().expect(201);

    expect((await getMine().expect(200)).body).toHaveLength(0);

    await reply(message._id, adminToken, "How can we help?").expect(201);

    expect((await getMine().expect(200)).body).toHaveLength(1);
    expect((await getMine(strangerToken).expect(200)).body).toHaveLength(0);
  });
});

describe("POST /api/contact-messages/:messageId/replies", () => {
  let message;

  beforeEach(async () => {
    message = (await sendMessage().expect(201)).body;
  });

  it("should let the admin and the user reply back and forth", async () => {
    await reply(message._id, adminToken, "How can we help?").expect(201);
    const response = await reply(message._id, userToken, "I can't log in.").expect(201);

    expect(response.body.replies.map((saved) => saved.from)).toEqual([
      "admin",
      "user",
    ]);
  });

  it("should let the admin reply to a guest message", async () => {
    const { body: guestMessage } = await sendMessage(null).expect(201);

    await reply(guestMessage._id, adminToken, "We'll email you.").expect(201);
  });

  it("should require authentication", async () => {
    await api
      .post(`/api/contact-messages/${message._id}/replies`)
      .send({ text: "Hello" })
      .expect(401);
  });

  it("should not let another user reply", async () => {
    await reply(message._id, strangerToken, "Hello").expect(403);

    const saved = await ContactMessage.findById(message._id);
    expect(saved.replies).toHaveLength(0);
  });

  it("should reject an empty or too long reply", async () => {
    await reply(message._id, adminToken, "  ").expect(400);
    await reply(message._id, adminToken, "a".repeat(1001)).expect(400);

    const saved = await ContactMessage.findById(message._id);
    expect(saved.replies).toHaveLength(0);
  });

  it("should return 404 or 400 for a missing or invalid message", async () => {
    await reply(new mongoose.Types.ObjectId(), adminToken, "Hello").expect(404);
    await reply("not-an-id", adminToken, "Hello").expect(400);
  });

  it("should bring a deleted conversation back for the other person", async () => {
    await api
      .delete(`/api/contact-messages/${message._id}/admin`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect((await getAdminList().expect(200)).body).toHaveLength(0);

    await reply(message._id, userToken, "Any update?").expect(201);

    expect((await getAdminList().expect(200)).body).toHaveLength(1);
  });
});

describe("PATCH /api/contact-messages/:messageId/read", () => {
  const markRead = (path, token) =>
    api.patch(`/api/contact-messages/${path}`).set("Authorization", `Bearer ${token}`);

  it("should require authentication", async () => {
    const { body: message } = await sendMessage().expect(201);

    await api.patch(`/api/contact-messages/${message._id}/read`).expect(401);
    await api.patch(`/api/contact-messages/${message._id}/admin/read`).expect(401);
  });

  it("should return 404 or 400 for a missing or invalid message", async () => {
    const missingId = new mongoose.Types.ObjectId();

    await markRead(`${missingId}/read`, userToken).expect(404);
    await markRead("not-an-id/read", userToken).expect(400);
    await markRead(`${missingId}/admin/read`, adminToken).expect(404);
    await markRead("not-an-id/admin/read", adminToken).expect(400);
  });
});

describe("DELETE /api/contact-messages/:messageId", () => {
  let message;

  beforeEach(async () => {
    message = (await sendMessage().expect(201)).body;
    await reply(message._id, adminToken, "How can we help?").expect(201);
  });

  const deleteForUser = (messageId, token = userToken) =>
    api
      .delete(`/api/contact-messages/${messageId}`)
      .set("Authorization", `Bearer ${token}`);

  const deleteForAdmin = (messageId, token = adminToken) =>
    api
      .delete(`/api/contact-messages/${messageId}/admin`)
      .set("Authorization", `Bearer ${token}`);

  it("should hide it only for the user who deleted it", async () => {
    await deleteForUser(message._id).expect(200);

    expect((await getMine().expect(200)).body).toHaveLength(0);
    expect((await getAdminList().expect(200)).body).toHaveLength(1);
    expect(await ContactMessage.findById(message._id)).not.toBeNull();
  });

  it("should hide it only for the admin who deleted it", async () => {
    await deleteForAdmin(message._id).expect(200);

    expect((await getAdminList().expect(200)).body).toHaveLength(0);
    expect((await getMine().expect(200)).body).toHaveLength(1);
  });

  it("should require authentication", async () => {
    await api.delete(`/api/contact-messages/${message._id}`).expect(401);
    await api.delete(`/api/contact-messages/${message._id}/admin`).expect(401);
  });

  it("should not let another user delete it", async () => {
    await deleteForUser(message._id, strangerToken).expect(403);

    const saved = await ContactMessage.findById(message._id);
    expect(saved.deletedByUser).toBe(false);
  });

  it("should not let a non-admin use the admin delete route", async () => {
    await deleteForAdmin(message._id, userToken).expect(403);

    const saved = await ContactMessage.findById(message._id);
    expect(saved.deletedByAdmin).toBe(false);
  });

  it("should return 404 or 400 for a missing or invalid message", async () => {
    await deleteForUser(new mongoose.Types.ObjectId()).expect(404);
    await deleteForUser("not-an-id").expect(400);
    await deleteForAdmin(new mongoose.Types.ObjectId()).expect(404);
    await deleteForAdmin("not-an-id").expect(400);
  });
});
