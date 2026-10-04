const mongoose = require("mongoose");
const Property = require("../models/propertyModel");
const Report = require("../models/reportModel");
const { publicPropertyScope } = require("../utils/propertyQueryHelpers");

const listingStatuses = ["active", "inactive", "sold", "rented"];
const moderationStatuses = ["unreviewed", "flagged", "approved", "removed"];
const moderationActionStatuses = ["flagged", "approved", "removed"];
const reportStatuses = ["open", "resolved"];
// Approving or removing a listing closes its open reports
const resolvingModerationStatuses = ["approved", "removed"];

const maxReportReasonLength = 500;

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

  const normalizedStatus = status.trim();

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        moderation: {
          status: normalizedStatus,
          reason: reason.trim(),
          moderatedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (resolvingModerationStatuses.includes(normalizedStatus)) {
      await Report.updateMany(
        { property: updatedProperty._id, status: "open" },
        { status: "resolved" },
      );
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

// POST /properties/:propertyId/report
// Any signed-in user except administrators can report a public listing once.
// The report is saved with the reporter, listing, reason and time, and the
// listing is flagged so administrators see it in the moderation panel.
const reportProperty = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  if (req.user.role === "administrator") {
    return res.status(403).json({
      message: "Administrators moderate listings from the admin panel",
    });
  }

  const reason = req.body?.reason;

  if (!isSingleNonBlankString(reason)) {
    return res.status(400).json({
      message: "Report reason must be a non-blank string",
    });
  }

  if (reason.trim().length > maxReportReasonLength) {
    return res.status(400).json({
      message: `Report reason must be at most ${maxReportReasonLength} characters`,
    });
  }

  try {
    const property = await Property.findOne({
      _id: propertyId,
      ...publicPropertyScope,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "You cannot report your own listing",
      });
    }

    let report;

    try {
      report = await Report.create({
        reporter: req.user._id,
        property: property._id,
        reason: reason.trim(),
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "You have already reported this listing",
        });
      }

      throw error;
    }

    const reportReason = `User report: ${report.reason}`;

    // Keep earlier reasons when a flagged listing is reported again
    const previousReason =
      property.moderation?.status === "flagged" && property.moderation.reason;

    try {
      await Property.updateOne(
        { _id: property._id },
        {
          moderation: {
            status: "flagged",
            reason: previousReason
              ? `${previousReason}
${reportReason}`
              : reportReason,
            moderatedAt: report.createdAt,
          },
        },
        { runValidators: true },
      );
    } catch (error) {
      // Don't keep a report for a listing that could not be flagged
      await Report.deleteOne({ _id: report._id });
      throw error;
    }

    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit report" });
  }
};

// GET /moderation/reports?status=open&propertyId=...
// Administrators see who reported which listing, why and when (newest first)
const getReports = async (req, res) => {
  const { status, propertyId } = req.query;

  if (
    status !== undefined &&
    (!isSingleNonBlankString(status) || !reportStatuses.includes(status.trim()))
  ) {
    return res.status(400).json({ message: "Invalid report status" });
  }

  if (
    propertyId !== undefined &&
    (typeof propertyId !== "string" ||
      !mongoose.Types.ObjectId.isValid(propertyId))
  ) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  const query = {};

  if (status !== undefined) {
    query.status = status.trim();
  }

  if (propertyId !== undefined) {
    query.property = propertyId;
  }

  try {
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate("reporter", "email firstName lastName")
      .populate("property", "title city address status moderation");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reports" });
  }
};

module.exports = {
  getModerationCandidates,
  updateModerationStatus,
  reportProperty,
  getReports,
};
