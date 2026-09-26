const AuthCode = require("../models/authCodeModel");
const ContactMessage = require("../models/contactMessageModel");
const Favourite = require("../models/favouriteModel");
const Inquiry = require("../models/inquiryModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const Verification = require("../models/verificationModel");
const { buildSeedData } = require("./seedData");

class SeedDataConflictError extends Error {
  constructor() {
    super(
      "Seed data or records linked to it already exist. Run npm run data:reset to restore the dataset.",
    );
    this.name = "SeedDataConflictError";
  }
}

const seedContext = () => {
  const data = buildSeedData();

  return {
    data,
    userIds: data.users.map(({ _id }) => _id),
    userEmails: data.users.map(({ email }) => email),
    propertyIds: data.properties.map(({ _id }) => _id),
  };
};

const seedFilters = ({ data, userIds, userEmails, propertyIds }) => ({
  authCodes: { email: { $in: userEmails } },
  contactMessages: {
    _id: { $in: data.contactMessages.map(({ _id }) => _id) },
  },
  favourites: {
    $or: [
      { _id: { $in: data.favourites.map(({ _id }) => _id) } },
      { user: { $in: userIds } },
      { propertyId: { $in: propertyIds } },
    ],
  },
  inquiries: {
    $or: [
      { _id: { $in: data.inquiries.map(({ _id }) => _id) } },
      { propertyId: { $in: propertyIds } },
    ],
  },
  verifications: {
    $or: [
      { _id: { $in: data.verifications.map(({ _id }) => _id) } },
      { user: { $in: userIds } },
      { reviewedBy: { $in: userIds } },
    ],
  },
  properties: {
    $or: [{ _id: { $in: propertyIds } }, { owner: { $in: userIds } }],
  },
  users: {
    $or: [{ _id: { $in: userIds } }, { email: { $in: userEmails } }],
  },
});

const exactSeedFilters = (data) => ({
  contactMessages: {
    _id: { $in: data.contactMessages.map(({ _id }) => _id) },
  },
  favourites: { _id: { $in: data.favourites.map(({ _id }) => _id) } },
  inquiries: { _id: { $in: data.inquiries.map(({ _id }) => _id) } },
  verifications: { _id: { $in: data.verifications.map(({ _id }) => _id) } },
  properties: { _id: { $in: data.properties.map(({ _id }) => _id) } },
  users: { _id: { $in: data.users.map(({ _id }) => _id) } },
});

const deleteByFilters = async (filters, { includeAuthCodes = false } = {}) => {
  const results = {};

  if (includeAuthCodes) {
    results.authCodes = (
      await AuthCode.deleteMany(filters.authCodes)
    ).deletedCount;
  }

  results.favourites = (
    await Favourite.deleteMany(filters.favourites)
  ).deletedCount;
  results.inquiries = (await Inquiry.deleteMany(filters.inquiries)).deletedCount;
  results.verifications = (
    await Verification.deleteMany(filters.verifications)
  ).deletedCount;
  results.contactMessages = (
    await ContactMessage.deleteMany(filters.contactMessages)
  ).deletedCount;
  results.properties = (
    await Property.deleteMany(filters.properties)
  ).deletedCount;
  results.users = (await User.deleteMany(filters.users)).deletedCount;

  return results;
};

const validateSeedData = async (data) => {
  const groups = [
    [User, data.users],
    [Property, data.properties],
    [Favourite, data.favourites],
    [Inquiry, data.inquiries],
    [Verification, data.verifications],
    [ContactMessage, data.contactMessages],
  ];

  for (const [Model, documents] of groups) {
    for (const document of documents) {
      await new Model(document).validate();
    }
  }
};

const hasSeedConflicts = async (context) => {
  const filters = seedFilters(context);
  const counts = await Promise.all([
    ContactMessage.countDocuments(filters.contactMessages),
    Favourite.countDocuments(filters.favourites),
    Inquiry.countDocuments(filters.inquiries),
    Verification.countDocuments(filters.verifications),
    Property.countDocuments(filters.properties),
    User.countDocuments(filters.users),
  ]);

  return counts.some((count) => count > 0);
};

const importSeedData = async () => {
  const context = seedContext();
  const { data } = context;

  await validateSeedData(data);

  if (await hasSeedConflicts(context)) {
    throw new SeedDataConflictError();
  }

  try {
    await User.insertMany(data.users);
    await Property.insertMany(data.properties);
    await Favourite.insertMany(data.favourites);
    await Inquiry.insertMany(data.inquiries);
    await Verification.insertMany(data.verifications);
    await ContactMessage.insertMany(data.contactMessages);
  } catch (error) {
    await deleteByFilters(exactSeedFilters(data));
    throw error;
  }

  return {
    users: data.users.length,
    properties: data.properties.length,
    favourites: data.favourites.length,
    inquiries: data.inquiries.length,
    verifications: data.verifications.length,
    contactMessages: data.contactMessages.length,
  };
};

const destroySeedData = async () => {
  const context = seedContext();
  return deleteByFilters(seedFilters(context), { includeAuthCodes: true });
};

const resetSeedData = async () => {
  await destroySeedData();
  return importSeedData();
};

module.exports = {
  SeedDataConflictError,
  destroySeedData,
  importSeedData,
  resetSeedData,
};
