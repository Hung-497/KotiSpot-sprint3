const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let owner;
let token;

// A tiny valid PNG, sent the same way the listing form sends photos
const pngDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const propertyData = {
  title: "Photo test property",
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
};

const image = (id, overrides = {}) => ({
  id,
  url: pngDataUrl,
  description: `Living room ${id}`,
  isMain: id === 1,
  ...overrides,
});

const createProperty = (images) =>
  api
    .post("/api/properties")
    .set("Authorization", `Bearer ${token}`)
    .send({ ...propertyData, images });

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
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Property images on create", () => {
  it("should save an ordered image list with one main image", async () => {
    const response = await createProperty([
      image(1),
      image(2, { url: "https://example.com/kitchen.jpg" }),
      image(3),
    ]).expect(201);

    expect(response.body.images).toHaveLength(3);
    expect(response.body.images.map((saved) => saved.id)).toEqual([1, 2, 3]);
    expect(response.body.images[0].isMain).toBe(true);
    expect(response.body.images[1].url).toBe("https://example.com/kitchen.jpg");
    expect(response.body.images[2].description).toBe("Living room 3");
  });

  it("should allow a listing without images", async () => {
    const response = await createProperty([]).expect(201);

    expect(response.body.images).toEqual([]);
  });

  it("should reject more than 8 images", async () => {
    const images = Array.from({ length: 9 }, (_, index) => image(index + 1));

    const response = await createProperty(images).expect(400);

    expect(response.body.message).toMatch(/up to 8 images/);
    expect(await Property.countDocuments()).toBe(0);
  });

  it("should reject images without exactly one main image", async () => {
    await createProperty([image(1), image(2, { isMain: true })]).expect(400);
    await createProperty([image(1, { isMain: false })]).expect(400);
  });

  it("should reject duplicate image ids", async () => {
    await createProperty([image(1), image(1, { isMain: false })]).expect(400);
  });

  it.each([
    ["a javascript link", "javascript:alert(1)"],
    ["an HTML data URL", "data:text/html;base64,PHNjcmlwdD48L3NjcmlwdD4="],
    ["an unsupported image type", "data:image/gif;base64,R0lGODlhAQABAAAAACw="],
    ["a data URL that is not base64", "data:image/png;base64,<not base64>"],
    ["a non-web link", "ftp://example.com/photo.jpg"],
    ["plain text", "not a url"],
  ])("should reject %s as an image", async (_, url) => {
    const response = await createProperty([image(1, { url })]).expect(400);

    expect(response.body.message).toMatch(/JPEG, PNG, or WebP/);
  });

  it("should reject a photo that is too large", async () => {
    const url = `data:image/jpeg;base64,${"A".repeat(1_000_000)}`;

    const response = await createProperty([image(1, { url })]).expect(400);

    expect(response.body.message).toMatch(/under 750 KB/);
  });

  it("should reject a blank or too long description", async () => {
    await createProperty([image(1, { description: "   " })]).expect(400);

    const response = await createProperty([
      image(1, { description: "a".repeat(201) }),
    ]).expect(400);

    expect(response.body.message).toMatch(/200 characters/);
  });

  it("should reject image fields with the wrong type", async () => {
    const response = await createProperty([image(1, { url: 123 })]).expect(400);

    // A cast error must not echo the submitted value back
    expect(response.body.message).toBe("Invalid property data");
  });
});

describe("Property images on update", () => {
  let property;

  beforeEach(async () => {
    const response = await createProperty([image(1), image(2)]).expect(201);
    property = response.body;
  });

  const updateImages = (images, authToken = token) =>
    api
      .patch(`/api/properties/${property.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ images });

  it("should let the owner change the main image, remove and add images", async () => {
    await updateImages([
      image(2, { isMain: true, description: "Balcony view" }),
      image(3, { url: "https://example.com/sauna.jpg" }),
    ]).expect(200);

    // Read it back from the database, as a refresh would
    const saved = await Property.findById(property.id);

    expect(saved.images.map((savedImage) => savedImage.id)).toEqual([2, 3]);
    expect(saved.images[0].isMain).toBe(true);
    expect(saved.images[0].description).toBe("Balcony view");
    expect(saved.images[1].isMain).toBe(false);
  });

  it("should let the owner remove all images", async () => {
    await updateImages([]).expect(200);

    const saved = await Property.findById(property.id);
    expect(saved.images).toHaveLength(0);
  });

  it("should reject invalid images and keep the old ones", async () => {
    const response = await updateImages([
      image(1, { url: "javascript:alert(1)" }),
    ]).expect(400);

    expect(response.body.message).toMatch(/JPEG, PNG, or WebP/);

    const saved = await Property.findById(property.id);
    expect(saved.images).toHaveLength(2);
  });

  it("should not let another user change the images", async () => {
    const otherUser = await User.create({
      email: "other@example.com",
      role: "seller",
      verifiedAt: new Date(),
    });
    const otherToken = jwt.sign({ _id: otherUser._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    await updateImages([], otherToken).expect(403);

    const saved = await Property.findById(property.id);
    expect(saved.images).toHaveLength(2);
  });
});
