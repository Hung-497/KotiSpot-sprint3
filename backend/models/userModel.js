const mongoose = require("mongoose");

const USER_ROLES = [
  "visitor",
  "buyer",
  "renter",
  "seller",
  "agent",
  "administrator",
];

const ROLE_ACTIONS = {
  visitor: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "sendInquiry",
  ],

  buyer: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "sendInquiry",
    "saveFavourites",
  ],

  renter: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "sendInquiry",
    "saveFavourites",
  ],

  seller: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "manageListings",
  ],

  agent: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "manageListings",
  ],

  administrator: [
    "browseProperties",
    "searchProperties",
    "viewPropertyDetails",
    "reviewVerification",
    "moderateListings",
  ],
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
    default: "buyer",
  },

  verifiedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

User.ROLES = USER_ROLES;
User.ROLE_ACTIONS = ROLE_ACTIONS;

module.exports = User;
