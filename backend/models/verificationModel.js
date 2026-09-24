const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ["seller", "agent"],
    required: true,
  },
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  companyName: { type: String, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  // Agent-only fields
  areas: { type: String, trim: true, maxlength: 300 },
  yearsExperience: { type: Number, min: 0, max: 80 },
  licenseNumber: { type: String, trim: true, maxlength: 100 },
  bio: { type: String, required: true, maxlength: 1000 },
  // Mock document references for Sprint 2
  idDocument: {
    type: String,
    required: true,
    trim: true,
  },
  licenseDocument: {
    type: String,
    trim: true,
    required: function () {
      return this.role === "agent";
    },
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true,
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewNote: { type: String, maxlength: 500 },
  rejectionReason: { type: String, trim: true, maxlength: 500 },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema,
);
