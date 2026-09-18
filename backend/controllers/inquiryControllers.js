const mongoose = require("mongoose");
const Inquiry = require("../models/inquiryModel");
const Property = require("../models/propertyModel");

const createInquiry = async (req, res) => {
  const { propertyId } = req.params;
  const { name, email, message } = req.body ?? {};

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({
      message: "Invalid property ID",
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      message: "Name, email, and message are required",
    });
  }

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const inquiry = await Inquiry.create({
      propertyId,
      name,
      email,
      message,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid inquiry data",
      });
    }

    res.status(500).json({
      message: "Failed to submit inquiry",
    });
  }
};

module.exports = {
  createInquiry,
};
