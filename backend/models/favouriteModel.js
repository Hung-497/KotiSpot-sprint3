const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      min: [1, "userId must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "userId must be a positive integer",
      },
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true },
);

favouriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
