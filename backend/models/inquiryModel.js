const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Message cannot exceed 1000 characters"],
    validate: {
      validator: (value) => value.trim() !== "",
      message: "Message must not be empty",
    },
  },

  // The person who listed the property (receives the inquiry)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // The logged-in user who sent it (empty for guests)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // The replies after the first message. Both people can reply as many times
  // as they want. "from" says who wrote it.
  replies: [
    {
      from: { type: String, enum: ["owner", "sender"], required: true },
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Reply cannot exceed 1000 characters"],
      },
      sentAt: { type: Date, default: Date.now },
    },
  ],

  // true when the owner / sender deleted it from their notifications
  deletedByOwner: {
    type: Boolean,
    default: false,
  },

  deletedBySender: {
    type: Boolean,
    default: false,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inquiry", inquirySchema);