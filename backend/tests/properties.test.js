const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const Property = require("../models/propertyModel");

const api = supertest(app);

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await Property.deleteMany({});

  await Property.create({
    ownerId: 1,
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

  await Property.create({
    ownerId: 1,
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

  await Property.create({
    ownerId: 1,
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

describe("POST /api/properties", () => {
  it("should create a valid property", async () => {
    const newProperty = {
      ownerId: 1,
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
      status: "active",
    };

    const response = await api
      .post("/api/properties")
      .send(newProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe("New test property");
  });

  it("should reject an invalid property", async () => {
    const response = await api.post("/api/properties").send({}).expect(400);
  });
});
