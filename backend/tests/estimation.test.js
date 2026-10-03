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
  it("should reject an invalid property", async () => {
    const response = await api
      .post("/api/estimate")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
  });
  it("should reject an invalid property type", async () => {
    const response = await api
      .post("/api/estimate")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":newProperty.postalCode,
        "size":newProperty.size,
        "rooms":newProperty.rooms,
        "buildingYear": newProperty.buildingYear,
        "buildingType": "invalid type",
      })
      .expect(400);
  });
  it("should reject an invalid size", async () => {
    const response = await api
      .post("/api/estimate")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":newProperty.postalCode,
        "size":-3,
        "rooms":newProperty.rooms,
        "buildingYear": newProperty.buildingYear,
        "buildingType": newProperty.propertySubType,
      })
      .expect(400);
  });
  it("should reject an invalid year", async () => {
    const response = await api
      .post("/api/estimate")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":newProperty.postalCode,
        "size":newProperty.size,
        "rooms":newProperty.rooms,
        "buildingYear": 538,
        "buildingType": newProperty.propertySubType,
      })
      .expect(400);
  });
  it("should reject property creation without authentication", async () => {
    const response = await api
      .post("/api/estimate")
      .send({ 
        "postalCode":newProperty.postalCode,
        "size":newProperty.size,
        "rooms":newProperty.rooms,
        "buildingYear": newProperty.buildingYear,
        "buildingType": newProperty.propertySubType,
      })
      .expect(401);
  });
});
describe("POST /api/estimate/growth", () => {
  const postalCode = "02100";
   it("should return estimate as JSON", async () => {
    const response = await api
      .post("/api/estimate/growth")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":postalCode,
      })
      .expect("Content-Type", /application\/json/);
    expect(response.body.postalCode).toBe(postalCode);
    expect(response.body.currentPpsm).toBe(4048);
    expect(response.body.annualGrowthPct).toBe(1.68);
     expect(response.body.forecast).toStrictEqual([
       {
         "ppsm": 4116,
         "year": 2026,
       },
       {
         "ppsm": 4185,
         "year": 2027,
       },
       {
         "ppsm": 4256,
         "year": 2028,
       },
       {
         "ppsm": 4327,
         "year": 2029,
       },
       {
         "ppsm": 4400,
         "year": 2030,
       },
     ]);
  });
  it("should reject an invalid request", async () => {
    const response = await api
      .post("/api/estimate/growth")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
  });
  it("should reject an invalid property code", async () => {
    const response = await api
      .post("/api/estimate/growth")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        "postalCode":"69",
      })
      .expect(400);
  });
});