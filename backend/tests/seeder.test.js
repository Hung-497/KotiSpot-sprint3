const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const AuthCode = require("../models/authCodeModel");
const ContactMessage = require("../models/contactMessageModel");
const Favourite = require("../models/favouriteModel");
const Inquiry = require("../models/inquiryModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const Verification = require("../models/verificationModel");
const { seedIds } = require("../data/seedData");
const {
  SeedDataConflictError,
  destroySeedData,
  importSeedData,
  resetSeedData,
} = require("../data/seedDatabase");
const { assertDevelopmentDatabase } = require("../seeder");

const api = supertest(app);
const unrelatedUserId = new mongoose.Types.ObjectId(
  "64f999999999999999999999",
);
const unrelatedPropertyId = new mongoose.Types.ObjectId(
  "65f999999999999999999999",
);

const allIds = (group) =>
  Object.values(group).map((value) => new mongoose.Types.ObjectId(value));

const seedPropertyIds = allIds(seedIds.properties);
const seedPropertyIdStrings = new Set(Object.values(seedIds.properties));

const seedResults = (properties) =>
  properties.filter((property) => seedPropertyIdStrings.has(property.id));

const countBy = (documents, field) =>
  documents.reduce((counts, document) => {
    const value = document[field];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await destroySeedData();
  await Property.deleteOne({ _id: unrelatedPropertyId });
  await User.deleteOne({ _id: unrelatedUserId });
});

afterAll(async () => {
  await destroySeedData();
  await Property.deleteOne({ _id: unrelatedPropertyId });
  await User.deleteOne({ _id: unrelatedUserId });
  await mongoose.connection.close();
});

it("imports the deterministic cross-model development dataset", async () => {
  const counts = await importSeedData();

  expect(counts).toEqual({
    users: 7,
    properties: 16,
    favourites: 3,
    inquiries: 2,
    verifications: 4,
    contactMessages: 1,
  });

  expect(
    await User.countDocuments({ _id: { $in: allIds(seedIds.users) } }),
  ).toBe(7);
  expect(
    await Property.countDocuments({ _id: { $in: seedPropertyIds } }),
  ).toBe(16);
  expect(
    await Favourite.countDocuments({
      _id: { $in: allIds(seedIds.favourites) },
    }),
  ).toBe(3);
  expect(
    await Inquiry.countDocuments({ _id: { $in: allIds(seedIds.inquiries) } }),
  ).toBe(2);
  expect(
    await Verification.countDocuments({
      _id: { $in: allIds(seedIds.verifications) },
    }),
  ).toBe(4);
  expect(
    await ContactMessage.countDocuments({
      _id: { $in: allIds(seedIds.contactMessages) },
    }),
  ).toBe(1);

  const seller = await User.findById(seedIds.users.seller);
  const helsinkiApartment = await Property.findById(
    seedIds.properties.helsinkiApartment,
  );

  expect(seller.role).toBe("seller");
  expect(seller.verifiedAt).toEqual(new Date("2026-01-10T09:00:00.000Z"));
  expect(helsinkiApartment.owner).toEqual(seller._id);
  expect(helsinkiApartment.createdAt).toEqual(
    new Date("2026-03-01T09:00:00.000Z"),
  );
  expect(
    await Property.countDocuments({
      _id: { $in: seedPropertyIds },
      images: { $ne: [] },
    }),
  ).toBe(0);
});

it("provides the exact public showcase distribution and filter coverage", async () => {
  await importSeedData();

  const publicProperties = await Property.find({
    _id: { $in: seedPropertyIds },
    status: "active",
    "moderation.status": "approved",
  });

  expect(publicProperties).toHaveLength(10);
  expect(countBy(publicProperties, "listingType")).toEqual({
    sale: 5,
    rent: 5,
  });
  expect(countBy(publicProperties, "city")).toEqual({
    Helsinki: 2,
    Espoo: 2,
    Tampere: 2,
    Vantaa: 2,
    Turku: 2,
  });
  expect(countBy(publicProperties, "propertySubType")).toEqual({
    apartment: 3,
    "detached-house": 2,
    studio: 2,
    "semi-detached-house": 2,
    "terraced-house": 1,
  });

  for (const field of ["price", "rooms", "bedrooms", "bathrooms", "size"]) {
    expect(new Set(publicProperties.map((property) => property[field])).size).toBeGreaterThan(1);
  }

  for (const feature of [
    "balcony",
    "elevator",
    "parking",
    "furnished",
    "petsAllowed",
    "sauna",
  ]) {
    expect(
      publicProperties.some((property) => property.features[feature] === true),
    ).toBe(true);
    expect(
      publicProperties.some((property) => property.features[feature] === false),
    ).toBe(true);

    const enabledResponse = await api
      .get(`/api/properties/filter?${feature}=true`)
      .expect(200);
    const disabledResponse = await api
      .get(`/api/properties/filter?${feature}=false`)
      .expect(200);

    expect(seedResults(enabledResponse.body).length).toBeGreaterThan(0);
    expect(seedResults(disabledResponse.body).length).toBeGreaterThan(0);
  }

  const terracedResponse = await api
    .get("/api/properties/filter?propertySubType=terraced-house")
    .expect(200);
  const semiDetachedResponse = await api
    .get("/api/properties/filter?propertySubType=semi-detached-house")
    .expect(200);

  expect(seedResults(terracedResponse.body)).toHaveLength(1);
  expect(seedResults(semiDetachedResponse.body)).toHaveLength(2);

  const searchResponse = await api
    .get("/api/properties/search?keyword=harbour&listingType=rent")
    .expect(200);

  expect(seedResults(searchResponse.body).map(({ id }) => id)).toEqual([
    seedIds.properties.helsinkiRental,
  ]);

  const newestResponse = await api
    .get("/api/properties/filter?sort=newest")
    .expect(200);

  expect(seedResults(newestResponse.body).map(({ id }) => id)).toEqual([
    seedIds.properties.turkuSemiDetached,
    seedIds.properties.vantaaStudio,
    seedIds.properties.tampereHouse,
    seedIds.properties.turkuApartment,
    seedIds.properties.vantaaTerraced,
    seedIds.properties.espooSemiDetached,
    seedIds.properties.helsinkiRental,
    seedIds.properties.tampereStudio,
    seedIds.properties.espooHouse,
    seedIds.properties.helsinkiApartment,
  ]);
});

it("keeps each moderation and listing lifecycle special state independent", async () => {
  await importSeedData();

  const scope = { _id: { $in: seedPropertyIds } };
  const stateCounts = await Promise.all([
    Property.countDocuments({
      ...scope,
      status: "active",
      "moderation.status": "unreviewed",
    }),
    Property.countDocuments({
      ...scope,
      status: "active",
      "moderation.status": "flagged",
    }),
    Property.countDocuments({
      ...scope,
      status: "inactive",
      "moderation.status": "approved",
    }),
    Property.countDocuments({
      ...scope,
      status: "sold",
      "moderation.status": "approved",
    }),
    Property.countDocuments({
      ...scope,
      status: "rented",
      "moderation.status": "approved",
    }),
    Property.countDocuments({
      ...scope,
      status: "active",
      "moderation.status": "removed",
    }),
  ]);

  expect(stateCounts).toEqual([1, 1, 1, 1, 1, 1]);
});

it("includes pending, approved, and rejected verification examples", async () => {
  await importSeedData();

  const verifications = await Verification.find({
    _id: { $in: allIds(seedIds.verifications) },
  });

  expect(verifications).toHaveLength(4);
  expect(
    verifications.some(
      ({ role, status }) => role === "seller" && status === "pending",
    ),
  ).toBe(true);
  expect(
    verifications.some(
      ({ role, status, user, reviewedBy }) =>
        role === "seller" &&
        status === "approved" &&
        user.equals(seedIds.users.seller) &&
        reviewedBy.equals(seedIds.users.administrator),
    ),
  ).toBe(true);
  expect(
    verifications.some(
      ({ role, status }) => role === "agent" && status === "approved",
    ),
  ).toBe(true);
  expect(
    verifications.some(
      ({ role, status }) => role === "agent" && status === "rejected",
    ),
  ).toBe(true);
});

it("refuses a second import instead of partially duplicating data", async () => {
  await importSeedData();

  await expect(importSeedData()).rejects.toBeInstanceOf(SeedDataConflictError);

  expect(
    await Property.countDocuments({ _id: { $in: seedPropertyIds } }),
  ).toBe(16);
});

it("resets seed-linked manual changes while preserving unrelated data", async () => {
  await importSeedData();

  await Property.findByIdAndUpdate(seedIds.properties.helsinkiApartment, {
    price: 1,
  });
  const manualProperty = await Property.create({
    owner: seedIds.users.seller,
    title: "Manual listing created during development",
    description: "This record should be removed by a seed reset.",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 100000,
    currency: "EUR",
    city: "Helsinki",
    address: "Manualikatu 1",
    postalCode: "00100",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    status: "active",
    moderation: { status: "unreviewed" },
  });
  const manualInquiry = await Inquiry.create({
    propertyId: seedIds.properties.helsinkiApartment,
    name: "Manual Tester",
    email: "manual@example.com",
    message: "This inquiry should be removed by a seed reset.",
  });
  await AuthCode.create({
    email: "seller@kotispot.dev",
    codeHash: "0".repeat(64),
    expiresAt: new Date(Date.now() + 60_000),
  });

  await User.create({
    _id: unrelatedUserId,
    email: "unrelated@example.com",
    role: "seller",
    verifiedAt: new Date("2026-01-01T00:00:00.000Z"),
  });
  await Property.create({
    _id: unrelatedPropertyId,
    owner: unrelatedUserId,
    title: "Unrelated development listing",
    description: "This record must survive seed reset and destroy.",
    listingType: "sale",
    propertyType: "residential",
    propertySubType: "apartment",
    price: 199000,
    currency: "EUR",
    city: "Lahti",
    address: "Sailyvakatu 1",
    postalCode: "15100",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 50,
    status: "active",
    moderation: { status: "approved" },
  });

  await resetSeedData();

  expect(await Property.findById(manualProperty._id)).toBeNull();
  expect(await Inquiry.findById(manualInquiry._id)).toBeNull();
  expect(
    await AuthCode.findOne({ email: "seller@kotispot.dev" }),
  ).toBeNull();
  expect(
    (await Property.findById(seedIds.properties.helsinkiApartment)).price,
  ).toBe(349000);
  expect(await User.findById(unrelatedUserId)).not.toBeNull();
  expect(await Property.findById(unrelatedPropertyId)).not.toBeNull();

  await destroySeedData();

  expect(
    await User.countDocuments({ _id: { $in: allIds(seedIds.users) } }),
  ).toBe(0);
  expect(
    await Property.countDocuments({ _id: { $in: seedPropertyIds } }),
  ).toBe(0);
  expect(await User.findById(unrelatedUserId)).not.toBeNull();
  expect(await Property.findById(unrelatedPropertyId)).not.toBeNull();
});

it("rejects production and TEST_MONGO_URI seed targets", () => {
  expect(() =>
    assertDevelopmentDatabase({
      nodeEnv: "production",
      mongoUri: "mongodb://example.invalid/kotispot",
      testMongoUri: "mongodb://example.invalid/kotispot-test",
    }),
  ).toThrow("Seed commands require NODE_ENV=development.");

  expect(() =>
    assertDevelopmentDatabase({
      nodeEnv: "development",
      mongoUri: "mongodb://example.invalid/kotispot-test",
      testMongoUri: "mongodb://example.invalid/kotispot-test",
    }),
  ).toThrow(
    "MONGO_URI must not point to TEST_MONGO_URI when running development seed commands.",
  );

  expect(() =>
    assertDevelopmentDatabase({
      nodeEnv: "development",
      mongoUri: "mongodb://example.invalid/kotispot",
      testMongoUri: "mongodb://example.invalid/kotispot-test",
    }),
  ).not.toThrow();
});
