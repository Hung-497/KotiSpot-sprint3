const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);
let owner;
let token;

beforeAll(async () => {
  await connectDB();
  // Build the unique reporter + property index before duplicate report tests
  await Report.init();
});

beforeEach(async () => {
  await Report.deleteMany({});
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
    buildingYear: 2000,
    size: 70,
    status: "active",
    moderation: {
      status: "approved",
    },
    createdAt: new Date("2026-01-01T09:00:00.000Z"),
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
    buildingYear: 2000,
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
    buildingYear: 2000,
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

    // Flagged listings stay public while under investigation
    expect(response.body.map((property) => property.title).sort()).toEqual([
      "Flagged apartment",
      "Test apartment",
    ]);
  });

  it("returns public listings newest first with a stable order for matching dates", async () => {
    const template = (await Property.findOne({ title: "Test apartment" })).toObject();
    delete template._id;
    delete template.__v;
    const newestDate = new Date("2026-02-01T09:00:00.000Z");

    const [older, newer, newest] = await Property.create([
      {
        ...template,
        title: "Older listing",
        createdAt: new Date("2025-12-01T09:00:00.000Z"),
      },
      {
        ...template,
        _id: new mongoose.Types.ObjectId("65f000000000000000000001"),
        title: "Newer listing",
        createdAt: newestDate,
      },
      {
        ...template,
        _id: new mongoose.Types.ObjectId("65f000000000000000000002"),
        title: "Newest listing",
        createdAt: newestDate,
      },
    ]);

    const response = await api.get("/api/properties").expect(200);

    expect(response.body.map(({ title }) => title)).toEqual([
      newest.title,
      newer.title,
      "Test apartment",
      older.title,
    ]);
  });
});

describe("GET /api/properties/filter", () => {
  beforeEach(async () => {
    await Property.create({
      owner: owner._id,
      title: "Espoo family house",
      description: "House with a sauna",
      listingType: "rent",
      propertyType: "residential",
      propertySubType: "detached-house",
      price: 1800,
      currency: "EUR",
      city: "Espoo",
      address: "Talotie 5",
      postalCode: "02100",
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
      buildingYear: 2000,
      size: 120,
      features: { sauna: true },
      rentalDetails: { availableFrom: "2026-10-01", minimumRentalPeriod: 12 },
      status: "active",
      moderation: { status: "approved" },
    });
  });

  it("should return only public properties when no filters are given", async () => {
    const response = await api.get("/api/properties/filter").expect(200);

    expect(response.body.map((property) => property.title).sort()).toEqual([
      "Espoo family house",
      "Flagged apartment",
      "Test apartment",
    ]);
  });

  it("should combine listing type, price and feature filters", async () => {
    const response = await api
      .get("/api/properties/filter")
      .query({ listingType: "rent", maxPrice: "2000", sauna: "true" })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Espoo family house");
  });

  it("should match keyword, city and postal code partially, ignoring case", async () => {
    const byKeyword = await api
      .get("/api/properties/filter")
      .query({ keyword: "FAMILY" })
      .expect(200);
    const byCity = await api
      .get("/api/properties/filter")
      .query({ city: "espoo" })
      .expect(200);
    const byPostalCode = await api
      .get("/api/properties/filter")
      .query({ postalCode: "001" })
      .expect(200);

    expect(byKeyword.body.map((property) => property.title)).toEqual([
      "Espoo family house",
    ]);
    expect(byCity.body.map((property) => property.title)).toEqual([
      "Espoo family house",
    ]);
    expect(byPostalCode.body.map((property) => property.title)).toEqual([
      "Test apartment",
      "Flagged apartment",
    ]);
  });

  it("should sort by price, highest first", async () => {
    const response = await api
      .get("/api/properties/filter")
      .query({ sort: "price-desc" })
      .expect(200);

    expect(response.body.map((property) => property.price)).toEqual([
      300000, 250000, 1800,
    ]);
  });

  it("should sort by price, lowest first", async () => {
    const response = await api
      .get("/api/properties/filter")
      .query({ sort: "price-asc" })
      .expect(200);

    expect(response.body.map((property) => property.price)).toEqual([
      1800, 250000, 300000,
    ]);
  });

  it("should sort by newest first", async () => {
    // Give the listings clearly different creation dates. The collection is
    // updated directly because Mongoose does not let createdAt be changed.
    await Property.collection.updateOne(
      { title: "Test apartment" },
      { $set: { createdAt: new Date("2026-01-01T00:00:00.000Z") } },
    );
    await Property.collection.updateOne(
      { title: "Espoo family house" },
      { $set: { createdAt: new Date("2026-02-01T00:00:00.000Z") } },
    );

    const response = await api
      .get("/api/properties/filter")
      .query({ sort: "newest" })
      .expect(200);

    // The flagged listing keeps its real creation date, so it is newest
    expect(response.body.map((property) => property.title)).toEqual([
      "Flagged apartment",
      "Espoo family house",
      "Test apartment",
    ]);
  });

  it("should reject invalid filter and sort values", async () => {
    await api.get("/api/properties/filter").query({ sort: "cheapest" }).expect(400);
    await api
      .get("/api/properties/filter")
      .query({ minPrice: "500", maxPrice: "100" })
      .expect(400);
    await api.get("/api/properties/filter").query({ keyword: " " }).expect(400);
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

  it("should still return a flagged property publicly", async () => {
    const property = await Property.findOne({ title: "Flagged apartment" });

    const response = await api
      .get(`/api/properties/${property._id}`)
      .expect(200);

    expect(response.body.moderation.status).toBe("flagged");
  });

  it("should not return a property removed by moderation", async () => {
    const property = await Property.findOneAndUpdate(
      { title: "Flagged apartment" },
      { "moderation.status": "removed" },
    );

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
      buildingYear: 2000,
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
      buildingYear: 2000,
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
      buildingYear: 2000,
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
      buildingYear: 2000,
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
      buildingYear: 2000,
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

describe("POST /api/properties/:propertyId/report", () => {
  let buyerToken;
  let property;

  const tokenFor = (user) =>
    jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "3d" });

  const report = (propertyId, authToken, body) => {
    const request = api.post(`/api/properties/${propertyId}/report`);

    if (authToken) {
      request.set("Authorization", `Bearer ${authToken}`);
    }

    return request.send(body);
  };

  let buyer;

  beforeEach(async () => {
    buyer = await User.create({ email: "buyer@example.com" });
    buyerToken = tokenFor(buyer);
    property = await Property.findOne({ title: "Test apartment" });
  });

  it("should save who reported which listing, why and when", async () => {
    const before = new Date();

    const response = await report(property._id, buyerToken, {
      reason: "  Photos are copied from another listing  ",
    }).expect(201);

    const reports = await Report.find({});

    expect(reports).toHaveLength(1);
    expect(reports[0].reporter.equals(buyer._id)).toBe(true);
    expect(reports[0].property.equals(property._id)).toBe(true);
    expect(reports[0].reason).toBe("Photos are copied from another listing");
    expect(reports[0].status).toBe("open");
    expect(reports[0].createdAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(response.body.report.id).toBe(reports[0]._id.toString());
  });

  it("should not let a user report the same listing twice", async () => {
    await report(property._id, buyerToken, { reason: "Suspicious" }).expect(201);
    await report(property._id, buyerToken, { reason: "Still suspicious" })
      .expect(409);

    const reported = await Property.findById(property._id);

    expect(await Report.countDocuments({})).toBe(1);
    expect(reported.moderation.reason).toBe("User report: Suspicious");
  });

  it("should let different users report the same listing", async () => {
    const otherBuyer = await User.create({ email: "other@example.com" });

    await report(property._id, buyerToken, { reason: "Suspicious" }).expect(201);
    await report(property._id, tokenFor(otherBuyer), { reason: "Fake photos" })
      .expect(201);

    expect(await Report.countDocuments({ property: property._id })).toBe(2);
  });

  it("should flag the listing with the report reason", async () => {
    await report(property._id, buyerToken, {
      reason: "  Photos are copied from another listing  ",
    }).expect(201);

    const reported = await Property.findById(property._id);

    expect(reported.moderation.status).toBe("flagged");
    expect(reported.moderation.reason).toBe(
      "User report: Photos are copied from another listing",
    );
    expect(reported.moderation.moderatedAt).toBeInstanceOf(Date);
  });

  it("should keep earlier reasons when a flagged listing is reported again", async () => {
    const flagged = await Property.findOne({ title: "Flagged apartment" });

    await report(flagged._id, buyerToken, { reason: "Asks for a deposit first" })
      .expect(201);

    const reported = await Property.findById(flagged._id);

    expect(reported.moderation.reason).toBe(
      "Under investigation\nUser report: Asks for a deposit first",
    );
  });

  it("should require authentication", async () => {
    await report(property._id, null, { reason: "Suspicious" }).expect(401);
  });

  it("should not let administrators report listings", async () => {
    const admin = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    await report(property._id, tokenFor(admin), { reason: "Suspicious" })
      .expect(403);
  });

  it("should not let owners report their own listing", async () => {
    await report(property._id, token, { reason: "Suspicious" }).expect(403);
  });

  it.each([
    ["missing", {}],
    ["blank", { reason: "   " }],
    ["not a string", { reason: ["Suspicious"] }],
    ["too long", { reason: "a".repeat(501) }],
  ])("should reject a reason that is %s", async (_, body) => {
    await report(property._id, buyerToken, body).expect(400);

    const unchanged = await Property.findById(property._id);
    expect(unchanged.moderation.status).toBe("approved");
    expect(await Report.countDocuments({})).toBe(0);
  });

  it("should return 404 for a listing that is not public", async () => {
    const inactive = await Property.findOne({ title: "Inactive apartment" });

    await report(inactive._id, buyerToken, { reason: "Suspicious" }).expect(404);
    await report(new mongoose.Types.ObjectId(), buyerToken, {
      reason: "Suspicious",
    }).expect(404);
  });

  it("should reject an invalid property ID", async () => {
    await report("not-an-id", buyerToken, { reason: "Suspicious" }).expect(400);
  });
});

describe("GET /api/moderation/reports", () => {
  let adminToken;
  let buyer;
  let property;
  let flagged;

  const getReports = (query = "", authToken = adminToken) =>
    api
      .get(`/api/moderation/reports${query}`)
      .set("Authorization", `Bearer ${authToken}`);

  beforeEach(async () => {
    const admin = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });
    adminToken = jwt.sign({ _id: admin._id }, JWT_SECRET, { expiresIn: "3d" });

    buyer = await User.create({
      email: "buyer@example.com",
      firstName: "Bea",
      lastName: "Buyer",
    });
    property = await Property.findOne({ title: "Test apartment" });
    flagged = await Property.findOne({ title: "Flagged apartment" });

    await Report.create({
      reporter: buyer._id,
      property: property._id,
      reason: "Photos are copied",
      createdAt: new Date("2026-01-01T10:00:00Z"),
    });
    await Report.create({
      reporter: buyer._id,
      property: flagged._id,
      reason: "Asks for a deposit first",
      status: "resolved",
      createdAt: new Date("2026-01-02T10:00:00Z"),
    });
  });

  it("should require authentication", async () => {
    await api.get("/api/moderation/reports").expect(401);
  });

  it("should reject non-administrators", async () => {
    await getReports("", token).expect(403);
  });

  it("should list reports newest first with reporter and listing details", async () => {
    const response = await getReports()
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);

    const [newest, oldest] = response.body;

    expect(newest.reason).toBe("Asks for a deposit first");
    expect(oldest.reason).toBe("Photos are copied");
    expect(oldest.reporter).toMatchObject({
      email: "buyer@example.com",
      firstName: "Bea",
      lastName: "Buyer",
    });
    expect(oldest.property.title).toBe("Test apartment");
    expect(oldest.status).toBe("open");
    expect(oldest.createdAt).toBe("2026-01-01T10:00:00.000Z");
  });

  it("should filter reports by status and listing", async () => {
    const open = await getReports("?status=open").expect(200);
    expect(open.body.map((item) => item.reason)).toEqual(["Photos are copied"]);

    const forFlagged = await getReports(`?propertyId=${flagged._id}`).expect(200);
    expect(forFlagged.body.map((item) => item.reason)).toEqual([
      "Asks for a deposit first",
    ]);
  });

  it.each([
    ["an unknown status", "?status=closed"],
    ["an invalid property ID", "?propertyId=not-an-id"],
  ])("should reject %s", async (_, query) => {
    await getReports(query).expect(400);
  });

  it("should resolve open reports when the listing is approved", async () => {
    await api
      .patch(`/api/moderation/properties/${property._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved", reason: "Photos checked" })
      .expect(200);

    const open = await getReports("?status=open").expect(200);
    expect(open.body).toHaveLength(0);
  });

  it("should keep reports open when the listing stays flagged", async () => {
    await api
      .patch(`/api/moderation/properties/${property._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "flagged", reason: "Still investigating" })
      .expect(200);

    const open = await getReports("?status=open").expect(200);
    expect(open.body).toHaveLength(1);
  });
});
