const mongoose = require("mongoose");
const Favourite = require("../models/favouriteModel");
const Property = require("../models/propertyModel");

// GET /favourites/:userId
const getAllFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id }).populate(
      "propertyId",
    );

    res.status(200).json(
      favourites.map((favourite) => ({
        favouriteId: favourite._id,
        user: favourite.user,
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
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existingFavourite = await Favourite.findOne({
      user: req.user._id,
      propertyId,
    });

    if (existingFavourite) {
      return res.status(400).json({ message: "Property already favourited" });
    }

    const favourite = await Favourite.create({
      user: req.user._id,
      propertyId,
    });

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
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const deletedFavourite = await Favourite.findOneAndDelete({
      user: req.user._id,
      propertyId,
    });

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
