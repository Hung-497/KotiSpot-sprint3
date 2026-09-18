const mongoose = require("mongoose");
const Favourite = require("../models/favouriteModel");
const Property = require("../models/propertyModel");

const parseUserId = (value) => {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null; // Invalid userId
  }

  return userId;
};

// GET /favourites/:userId
const getAllFavourites = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const favourites = await Favourite.find({ userId }).populate("propertyId");

    res.status(200).json(
      favourites.map((favourite) => ({
        favouriteId: favourite._id,
        userId: favourite.userId,
        available: favourite.propertyId !== null,
        property: favourite.propertyId,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve favourites" });
  }
};

// POST /favourites/:userId/:propertyId
const addFavourite = async (req, res) => {
  let { userId, propertyId } = req.params;
  userId = parseUserId(userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existingFavourite = await Favourite.findOne({ userId, propertyId });

    if (existingFavourite) {
      return res.status(409).json({ message: "Property already favourited" });
    }

    const favourite = await Favourite.create({ userId, propertyId });
    res.status(201).json(favourite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Property already favourited" });
    }

    res.status(500).json({ message: "Failed to add favourite" });
  }
};

// DELETE /favourites/:userId/:propertyId
const deleteFavourite = async (req, res) => {
  let { userId, propertyId } = req.params;
  userId = parseUserId(userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const deletedFavourite = await Favourite.findOneAndDelete({ userId, propertyId });

    if (!deletedFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Favourite deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete favourite" });
  }
};

module.exports = {
  getAllFavourites,
  addFavourite,
  deleteFavourite,
};
