const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Favourite = require("../models/favouriteModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let user;
let token;
let property;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await Favourite.deleteMany({});
  await Property.deleteMany({});
  await User.deleteMany({});

  user = await User.create({
    email: "buyer@example.com",
    role: "buyer",
  });

  token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "3d",
  });

  property = await Property.create({
    owner: user._id,
    title: "Favourite test property",
    description: "Property used for favourite tests",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 250000,
    currency: "EUR",
    city: "Helsinki",
    address: "Favouritekatu 1",
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

describe("GET /api/favourites", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/favourites").expect(401);
  });

  it("should return only favourites belonging to the authenticated user", async () => {
    const otherUser = await User.create({
      email: "otherbuyer@example.com",
      role: "buyer",
    });

    await Favourite.create({
      user: user._id,
      propertyId: property._id,
    });

    await Favourite.create({
      user: otherUser._id,
      propertyId: property._id,
    });

    const response = await api
      .get("/api/favourites")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].user).toBe(user._id.toString());
    expect(response.body[0].property.id).toBe(property._id.toString());
  });
});

describe("POST /api/favourites/:propertyId", () => {
  it("should reject adding a favourite without authentication", async () => {
    await api.post(`/api/favourites/${property._id}`).expect(401);
  });

  it("should add a favourite for the authenticated user", async () => {
    const response = await api
      .post(`/api/favourites/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user).toBe(user._id.toString());
    expect(response.body.propertyId).toBe(property._id.toString());

    const favourite = await Favourite.findOne({
      user: user._id,
      propertyId: property._id,
    });

    expect(favourite).not.toBeNull();
  });
});

describe("DELETE /api/favourites/:propertyId", () => {
  it("should reject deleting a favourite without authentication", async () => {
    await api.delete(`/api/favourites/${property._id}`).expect(401);
  });

  it("should delete the authenticated user's favourite", async () => {
    await Favourite.create({
      user: user._id,
      propertyId: property._id,
    });

    const response = await api
      .delete(`/api/favourites/${property._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("Favourite deleted successfully");

    const favourite = await Favourite.findOne({
      user: user._id,
      propertyId: property._id,
    });

    expect(favourite).toBeNull();
  });
});
