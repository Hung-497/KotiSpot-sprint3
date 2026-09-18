const mongoose = require("mongoose");
const Property = require("../models/propertyModel");

const listingStatuses = ["active", "inactive", "sold", "rented"];
const moderationStatuses = ["unreviewed", "flagged", "approved", "removed"];
const moderationActionStatuses = ["flagged", "approved", "removed"];

const isSingleNonBlankString = (value) =>
  typeof value === "string" && value.trim() !== "";

const getModerationCandidates = async (req, res) => {
  const { listingStatus, moderationStatus } = req.query;

  if (
    listingStatus !== undefined &&
    (!isSingleNonBlankString(listingStatus) ||
      !listingStatuses.includes(listingStatus.trim()))
  ) {
    return res.status(400).json({ message: "Invalid listing status" });
  }

  if (
    moderationStatus !== undefined &&
    (!isSingleNonBlankString(moderationStatus) ||
      !moderationStatuses.includes(moderationStatus.trim()))
  ) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }

  const query = {};

  if (listingStatus !== undefined) {
    query.status = listingStatus.trim();
  }

  const normalizedModerationStatus = moderationStatus?.trim();

  if (normalizedModerationStatus === "unreviewed") {
    query.$or = [
      { "moderation.status": "unreviewed" },
      { moderation: { $exists: false } },
    ];
  } else if (moderationStatus !== undefined) {
    query["moderation.status"] = normalizedModerationStatus;
  }

  try {
    const properties = await Property.find(query);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve moderation candidates",
    });
  }
};

const updateModerationStatus = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  const body = req.body;
  const bodyKeys =
    body && typeof body === "object" && !Array.isArray(body)
      ? Object.keys(body)
      : [];

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    bodyKeys.length !== 2 ||
    !bodyKeys.includes("status") ||
    !bodyKeys.includes("reason")
  ) {
    return res.status(400).json({
      message: "Moderation status and reason are required",
    });
  }

  const { status, reason } = body;

  if (
    typeof status !== "string" ||
    !moderationActionStatuses.includes(status.trim())
  ) {
    return res.status(400).json({ message: "Invalid moderation action" });
  }

  if (!isSingleNonBlankString(reason)) {
    return res.status(400).json({
      message: "Moderation reason must be a non-blank string",
    });
  }

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        moderation: {
          status: status.trim(),
          reason: reason.trim(),
          moderatedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid moderation data",
      });
    }

    res.status(500).json({
      message: "Failed to update moderation status",
    });
  }
};

module.exports = {
  getModerationCandidates,
  updateModerationStatus,
};
