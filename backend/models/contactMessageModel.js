const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  fullName: {
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

  subject: {
    type: String,
    required: true,
    trim: true,
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

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
