const Property = require("../models/propertyModel");
const mongoose = require("mongoose");
const {
  addNumericRangeFilter,
  addBooleanFilter,
} = require("../utils/propertyQueryHelpers");

const publicPropertyScope = {
  status: "active",
  "moderation.status": "approved",
};

const hasModerationInput = (body) =>
  body &&
  typeof body === "object" &&
  Object.keys(body).some(
    (key) => key === "moderation" || key.startsWith("moderation."),
  );
const hasValidRequestBody = (body) =>
  body &&
  typeof body === "object" &&
  !Array.isArray(body) &&
  Object.keys(body).length > 0;

// GET /properties
const getActiveProperties = async (req, res) => {
  try {
    const properties = await Property.find(publicPropertyScope);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve properties" });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve properties" });
  }
};

// POST /properties
const createProperty = async (req, res) => {
  if (!hasValidRequestBody(req.body)) {
    return res.status(400).json({
      message: "Property data is required",
    });
  }

  if (hasModerationInput(req.body)) {
    return res.status(400).json({
      message: "Moderation can only be changed through moderation routes",
    });
  }

  try {
    const newProperty = await Property.create({
      ...req.body,
      owner: req.user._id,
      status: "active", // Set default status to "active"
      moderation: {
        // Agents and administrators are auto-approved; sellers need review
        status: ["agent", "administrator"].includes(req.user.role)
          ? "approved"
          : "unreviewed",
      },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      res.status(400).json({ message: "Invalid property data" });
    } else {
      res.status(500).json({ message: "Failed to create property" });
    }
  }
};

// GET /properties/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findOne({
      _id: propertyId,
      ...publicPropertyScope,
    });
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve property" });
  }
};

// PATCH /properties/:propertyId
const updateProperty = async (req, res) => {
  try {
    const updates = {...req.body };

    delete updates.owner; // Prevent changing the owner
    delete updates.moderation; // Prevent changing moderation directly

    Object.assign(req.property, updates);

    await req.property.save();

    res.status(200).json(req.property);
  } catch (error) {
    res.status(400).json({ message: "Failed to update property" });
  }
};

// DELETE /properties/:propertyId
const deleteProperty = async (req, res) => {
  try {
    await req.property.deleteOne();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

const filterProperties = async (req, res) => {
  try {
    const { sort } = req.query;
    const query = {
      ...publicPropertyScope,
    };

    const validSorts = ["price-asc", "price-desc", "newest"];
    if (
      sort !== undefined &&
      (typeof sort !== "string" || !validSorts.includes(sort))
    ) {
      return res.status(400).json({ message: "Invalid sort value" });
    }

    const validListingTypes = ["sale", "rent", "any"];
    const validPropertyTypes = ["residential", "any"];
    const validPropertySubTypes = [
      "apartment",
      "detached-house",
      "studio",
      "semi-detached-house",
      "terraced-house",
      "any",
    ];

    // listingType validation
    if (
      req.query.listingType !== undefined &&
      !validListingTypes.includes(req.query.listingType)
    ) {
      return res.status(400).json({
        message: "Invalid listing type",
      });
    }

    // propertyType validation
    if (
      req.query.propertyType !== undefined &&
      !validPropertyTypes.includes(req.query.propertyType)
    ) {
      return res.status(400).json({
        message: "Invalid property type",
      });
    }

    // propertySubType validation
    if (
      req.query.propertySubType !== undefined &&
      !validPropertySubTypes.includes(req.query.propertySubType)
    ) {
      return res.status(400).json({
        message: "Invalid property subtype",
      });
    }

    if (
      req.query.listingType !== undefined &&
      req.query.listingType !== "any"
    ) {
      query.listingType = req.query.listingType;
    }

    if (
      req.query.propertyType !== undefined &&
      req.query.propertyType !== "any"
    ) {
      query.propertyType = req.query.propertyType;
    }

    if (
      req.query.propertySubType !== undefined &&
      req.query.propertySubType !== "any"
    ) {
      query.propertySubType = req.query.propertySubType;
    }

    const numericRanges = [
      ["price", "minPrice", "maxPrice"],
      ["rooms", "minRooms", "maxRooms"],
      ["bedrooms", "minBedrooms", "maxBedrooms"],
      ["bathrooms", "minBathrooms", "maxBathrooms"],
      ["size", "minSize", "maxSize"],
    ];

    for (const [field, minParameter, maxParameter] of numericRanges) {
      const validationMessage = addNumericRangeFilter(
        query,
        field,
        req.query[minParameter],
        req.query[maxParameter],
      );

      if (validationMessage) {
        return res.status(400).json({ message: validationMessage });
      }
    }

    for (const feature of [
      "balcony",
      "elevator",
      "parking",
      "furnished",
      "petsAllowed",
      "sauna",
    ]) {
      const validationMessage = addBooleanFilter(
        query,
        feature,
        req.query[feature],
      );

      if (validationMessage) {
        return res.status(400).json({ message: validationMessage });
      }
    }

    for (const field of ["city", "currency"]) {
      if (req.query[field] !== undefined) {
        if (
          typeof req.query[field] !== "string" ||
          req.query[field].trim() === ""
        ) {
          return res.status(400).json({ message: `Invalid ${field} value` });
        }

        if (req.query[field].trim() !== "any") {
          query[field] = req.query[field].trim();
        }
      }
    }

    const propertyQuery = Property.find(query);

    if (sort === "price-asc") {
      propertyQuery.sort({ price: 1 });
    } else if (sort === "price-desc") {
      propertyQuery.sort({ price: -1 });
    } else if (sort === "newest") {
      propertyQuery.sort({ createdAt: -1 });
    }

    const properties = await propertyQuery;

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter properties" });
  }
};

// GET keyword
const getPropertyByKeyword = async (req, res) => {
  const { keyword, listingType } = req.query;

  if (typeof keyword !== "string" || keyword.trim() === "") {
    return res
      .status(400)
      .json({ message: "Keyword must be a single non-blank value" });
  }

  const validListingTypes = ["sale", "rent", "any"];
  if (
    listingType !== undefined &&
    (typeof listingType !== "string" ||
      !validListingTypes.includes(listingType))
  ) {
    return res.status(400).json({ message: "Invalid listing type" });
  }

  const escapedKeyword = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const query = {
    ...publicPropertyScope,
    $or: [
      { title: { $regex: escapedKeyword, $options: "i" } },
      { description: { $regex: escapedKeyword, $options: "i" } },
      { city: { $regex: escapedKeyword, $options: "i" } },
      { address: { $regex: escapedKeyword, $options: "i" } },
    ],
  };

  if (listingType !== undefined && listingType !== "any") {
    query.listingType = listingType;
  }

  try {
    const properties = await Property.find(query);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search properties",
    });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to get your properties" });
  }
};

module.exports = {
  getActiveProperties,
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  filterProperties,
  getPropertyByKeyword,
  getMyProperties,
};
