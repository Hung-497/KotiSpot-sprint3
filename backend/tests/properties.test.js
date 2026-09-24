const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);
let owner;
let token;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await Property.deleteMany({});
  await User.deleteMany({});

  owner = await User.create({
    email: "owner@example.com",
    role: "seller",
    verifiedAt: new Date(),
  });

  token = jwt.sign({ _id: owner._id }, JWT_SECRET, { expiresIn: "3d" });

  await Property.create({
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

  const flaggedProperty = await Property.create({
    owner: owner._id,
    title: "Flagged apartment",
    description: "Flagged test property",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 300000,
    currency: "EUR",
    city: "Helsinki",
    address: "Flaggedkatu 2",
    postalCode: "00100",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 50,
    status: "active",
    moderation: {
      status: "flagged",
      reason: "Under investigation",
    },
  });

  const inactiveProperty = await Property.create({
    owner: owner._id,
    title: "Inactive apartment",
    description: "Inactive test property",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 200000,
    currency: "EUR",
    city: "Helsinki",
    address: "Inactivekatu 3",
    postalCode: "00100",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    status: "inactive",
    moderation: {
      status: "approved",
    },
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/properties", () => {
  it("should return properties as JSON", async () => {
    const response = await api
      .get("/api/properties")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Test apartment");
  });
});

describe("GET /api/properties/:propertyId", () => {
  it("should return an active approved property", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const response = await api
      .get(`/api/properties/${property._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe("Test apartment");
  });

  it("should not return a flagged property publicly", async () => {
    const property = await Property.findOne({ title: "Flagged apartment" });

    await api.get(`/api/properties/${property._id}`).expect(404);
  });
});

describe("GET /api/properties/all", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/properties/all").expect(401);
  });

  it("should reject access for a non-administrator", async () => {
    await api
      .get("/api/properties/all")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should allow an administrator to access all properties", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const response = await api
      .get("/api/properties/all")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(3);
  });
});

describe("GET /api/moderation/properties", () => {
  it("should reject moderation access without authentication", async () => {
    await api.get("/api/moderation/properties").expect(401);
  });

  it("should reject moderation access for a non-administrator", async () => {
    await api
      .get("/api/moderation/properties")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should allow an administrator to access moderation candidates", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const response = await api
      .get("/api/moderation/properties")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(3);
  });
});

describe("PATCH /api/moderation/properties/:propertyId", () => {
  it("should allow an administrator to update moderation status", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const property = await Property.findOne({
      title: "Flagged apartment",
    });

    const response = await api
      .patch(`/api/moderation/properties/${property._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "approved",
        reason: "Reviewed by administrator",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.moderation.status).toBe("approved");
    expect(response.body.moderation.reason).toBe("Reviewed by administrator");
  });

  it("should reject moderation update without authentication", async () => {
    const property = await Property.findOne({
      title: "Flagged apartment",
    });

    await api
      .patch(`/api/moderation/properties/${property._id}`)
      .send({
        status: "approved",
        reason: "Unauthorized moderation attempt",
      })
      .expect(401);
  });

  it("should reject moderation update for a non-administrator", async () => {
    const property = await Property.findOne({
      title: "Flagged apartment",
    });

    await api
      .patch(`/api/moderation/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "approved",
        reason: "Seller moderation attempt",
      })
      .expect(403);
  });
});

describe("POST /api/properties", () => {
  it("should create a valid property", async () => {
    const newProperty = {
      title: "New test property",
      description: "Created by automated test",
      listingType: "sale",
      propertyType: "residential",
      propertySubType: "apartment",
      price: 220000,
      currency: "EUR",
      city: "Espoo",
      address: "Testitie 4",
      postalCode: "02100",
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      size: 55,
      status: "inactive",
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(newProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe("New test property");
    expect(response.body.owner).toBe(owner._id.toString());
    expect(response.body.status).toBe("active");
    expect(response.body.moderation.status).toBe("unreviewed");

    await api.get(`/api/properties/${response.body.id}`).expect(404);
  });

  it("should reject an invalid property", async () => {
    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
  });

  it("should reject property creation without authentication", async () => {
    await api
      .post("/api/properties")
      .send({
        title: "Unauthorized property",
      })
      .expect(401);
  });

  it("should ignore an owner supplied by the client", async () => {
    const otherUser = await User.create({
      email: "other@example.com",
    });

    const newProperty = {
      owner: otherUser._id.toString(),
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
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(newProperty)
      .expect(201);

    expect(response.body.owner).toBe(owner._id.toString());
  });

  it("should auto-approve a property created by a verified agent", async () => {
    const agent = await User.create({
      email: "agent@example.com",
      role: "agent",
      verifiedAt: new Date(),
    });

    const agentToken = jwt.sign({ _id: agent._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const newProperty = {
      title: "Agent property",
      description: "Created by verified agent",
      listingType: "sale",
      propertyType: "residential",
      propertySubType: "apartment",
      price: 300000,
      currency: "EUR",
      city: "Helsinki",
      address: "Agenttikatu 1",
      postalCode: "00100",
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      size: 70,
      status: "inactive",
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${agentToken}`)
      .send(newProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.owner).toBe(agent._id.toString());
    expect(response.body.status).toBe("active");
    expect(response.body.moderation.status).toBe("approved");

    await api.get(`/api/properties/${response.body.id}`).expect(200);
  });

  it("should reject moderation supplied by the client", async () => {
    const newProperty = {
      title: "Client moderated property",
      description: "Client should not control moderation",
      listingType: "sale",
      propertyType: "residential",
      propertySubType: "apartment",
      price: 250000,
      currency: "EUR",
      city: "Helsinki",
      address: "Moderationkatu 1",
      postalCode: "00100",
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      size: 70,
      moderation: {
        status: "approved",
      },
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(newProperty)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe(
      "Moderation can only be changed through moderation routes",
    );
  });
});

describe("GET /api/properties/mine", () => {
  it("should reject my listings without authentication", async () => {
    await api.get("/api/properties/mine").expect(401);
  });

  it("should return only properties owned by the authenticated user", async () => {
    const otherUser = await User.create({
      email: "otherowner@example.com",
    });

    await Property.create({
      owner: otherUser._id,
      title: "Other owner's property",
      description: "Not owned by logged-in user",
      listingType: "sale",
      propertyType: "residential",
      propertySubType: "apartment",
      price: 200000,
      currency: "EUR",
      city: "Helsinki",
      address: "Otherkatu 1",
      postalCode: "00100",
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      size: 50,
      status: "active",
      moderation: {
        status: "approved",
      },
    });

    const response = await api
      .get("/api/properties/mine")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(
      response.body.every(
        (property) => property.owner === owner._id.toString(),
      ),
    ).toBe(true);

    expect(
      response.body.some(
        (property) => property.title === "Other owner's property",
      ),
    ).toBe(false);
  });
});

describe("PATCH /api/properties/:propertyId", () => {
  it("should allow the owner to update their property", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const response = await api
      .patch(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated apartment",
        price: 275000,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe("Updated apartment");
    expect(response.body.price).toBe(275000);
  });

  it("should reject a user who does not own the property", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const otherUser = await User.create({
      email: "otherseller@example.com",
      role: "seller",
      verifiedAt: new Date(),
    });

    const otherToken = jwt.sign({ _id: otherUser._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    await api
      .patch(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        title: "Stolen apartment",
      })
      .expect(403);
  });

  it("should not allow the owner to change the property owner", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const otherUser = await User.create({
      email: "newowner@example.com",
    });

    const response = await api
      .patch(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        owner: otherUser._id.toString(),
      })
      .expect(200);

    expect(response.body.owner).toBe(owner._id.toString());
  });

  it("should not allow the owner to change moderation status", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const response = await api
      .patch(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderation: {
          status: "removed",
        },
      })
      .expect(200);

    expect(response.body.moderation.status).toBe("approved");
  });
});

describe("DELETE /api/properties/:propertyId", () => {
  it("should allow the owner to delete their property", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const response = await api
      .delete(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("Property deleted successfully");
  });

  it("should reject property deletion without authentication", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    await api.delete(`/api/properties/${property._id}`).expect(401);
  });

  it("should reject a user who does not own the property", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    const otherUser = await User.create({
      email: "otherdeleteseller@example.com",
      role: "seller",
      verifiedAt: new Date(),
    });

    const otherToken = jwt.sign({ _id: otherUser._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    await api
      .delete(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403);
  });

  it("should remove the deleted property from the database", async () => {
    const property = await Property.findOne({ title: "Test apartment" });

    await api
      .delete(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const deletedProperty = await Property.findById(property._id);

    expect(deletedProperty).toBeNull();
  });
});
