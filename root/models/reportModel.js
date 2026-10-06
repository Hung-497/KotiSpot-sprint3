const mongoose = require("mongoose");

const MAX_REPORT_REASON_LENGTH = 500;

// One document per user report on a listing. createdAt is the report time.
const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: [
        MAX_REPORT_REASON_LENGTH,
        `report reason cannot exceed ${MAX_REPORT_REASON_LENGTH} characters`,
      ],
      validate: {
        validator: (value) => value.trim() !== "",
        message: "report reason must not be blank",
      },
    },
    // A report stays open until an administrator approves or removes the listing
    status: {
      type: String,
      required: true,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  { timestamps: true },
);

// A user can report the same listing only once
reportSchema.index({ reporter: 1, property: 1 }, { unique: true });

reportSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
