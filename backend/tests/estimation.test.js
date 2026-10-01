const supertest = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
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
  await User.deleteMany({});

  owner = await User.create({
    email: "owner@example.com",
    role: "seller",
    verifiedAt: new Date(),
  });

  token = jwt.sign({ _id: owner._id }, JWT_SECRET, { expiresIn: "3d" });

});

describe("POST /api/estimate", () => {
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
      buildingYear: 2013,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      size: 55,
      status: "inactive",
    };
  it("should return estimate as JSON", async () => {
    const response = await api
      .post("/api/estimate")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":newProperty.postalCode,
        "size":newProperty.size,
        "rooms":newProperty.rooms,
        "buildingYear": newProperty.buildingYear,
        "buildingType": newProperty.propertySubType,
      })
      .expect("Content-Type", /application\/json/);
    expect(response.body.estimate).toBe(273000);
  });
});