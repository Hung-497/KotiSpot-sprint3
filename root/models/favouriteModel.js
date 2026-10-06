const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true },
);

favouriteSchema.index({ user: 1, propertyId: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
