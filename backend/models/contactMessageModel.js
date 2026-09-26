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

  // The logged-in user who sent the message (empty for guests)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // The replies after the first message. Both the admin and the user can
  // reply as many times as they want. "from" says who wrote it.
  replies: [
    {
      from: { type: String, enum: ["admin", "user"], required: true },
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Reply cannot exceed 1000 characters"],
      },
      sentAt: { type: Date, default: Date.now },
    },
  ],

  // true when the user / admin deleted it from their notifications
  deletedByUser: {
    type: Boolean,
    default: false,
  },

  deletedByAdmin: {
    type: Boolean,
    default: false,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
