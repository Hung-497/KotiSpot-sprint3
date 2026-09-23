const Verification = require("../models/verificationModel");
const User = require("../models/userModel");

const parseUserId = (value) => {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

const createVerification = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingRequest = await Verification.findOne({
      userId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "A pending verification request already exists for this user",
      });
    }

    const {
      role,
      fullName,
      companyName,
      phone,
      email,
      areas,
      yearsExperience,
      licenseNumber,
      bio,
      idDocument,
      licenseDocument,
    } = req.body ?? {};

    if (!["seller", "agent"].includes(role)) {
      return res.status(400).json({
        message: "Role must be seller or agent",
      });
    }

    if (typeof idDocument !== "string" || idDocument.trim() === "") {
      return res.status(400).json({
        message: "ID document is required",
      });
    }

    if (
      role === "agent" &&
      (typeof licenseDocument !== "string" || licenseDocument.trim() === "")
    ) {
      return res.status(400).json({
        message: "License/certification document is required for agents",
      });
    }

    const verificationRequest = await Verification.create({
      userId,
      role,
      fullName,
      companyName,
      phone,
      email,
      areas,
      yearsExperience,
      licenseNumber,
      bio,
      idDocument,
      licenseDocument: role === "agent" ? licenseDocument : undefined,
    });

    res.status(201).json(verificationRequest);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid verification request data" });
    }

    res.status(500).json({ message: "Failed to create verification request" });
  }
};

const getUserVerification = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const verificationRequest = await Verification.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!verificationRequest) {
      return res
        .status(404)
        .json({ message: "Verification request not found for this user" });
    }

    res.status(200).json(verificationRequest);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve verification request" });
  }
};

const getApplications = async (req, res) => {
  const { status } = req.query;

  if (
    status !== undefined &&
    (typeof status !== "string" ||
      !["pending", "approved", "rejected"].includes(status))
  ) {
    return res.status(400).json({
      message: "Invalid verification status",
    });
  }

  try {
    const filter = status ? { status } : {};

    const applications = await Verification.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve verification applications",
    });
  }
};

const reviewApplication = async (req, res) => {
  const { applicationId } = req.params;

  const { status, reviewedBy, reviewNote, rejectionReason } = req.body ?? {};

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be either "approved" or "rejected".',
    });
  }

  const reviewerId = parseUserId(reviewedBy);

  if (reviewerId === null) {
    return res.status(400).json({
      message: "Invalid reviewedBy user ID",
    });
  }

  if (
    status === "rejected" &&
    (typeof rejectionReason !== "string" || rejectionReason.trim() === "")
  ) {
    return res.status(400).json({
      message: "Rejection reason is required",
    });
  }

  try {
    const verificationRequest = await Verification.findById(applicationId);
    if (!verificationRequest) {
      return res
        .status(404)
        .json({ message: "Verification request not found for this user" });
    }

    if (verificationRequest.status !== "pending") {
      return res.status(409).json({
        message: "This verification application has already been reviewed",
      });
    }

    verificationRequest.status = status;
    verificationRequest.reviewedBy = reviewerId;
    verificationRequest.reviewedAt = new Date();
    verificationRequest.reviewNote = reviewNote || undefined;

    verificationRequest.rejectionReason =
      status === "rejected" ? rejectionReason.trim() : undefined;

    await verificationRequest.save();

    if (status === "approved") {
      await User.findOneAndUpdate(
        { userId: verificationRequest.userId },
        { role: verificationRequest.role, verifiedAt: new Date() },
        { returnDocument: "after", runValidators: true },
      );
    }

    res.status(200).json(verificationRequest);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    res.status(500).json({
      message: "Failed to review verification application",
    });
  }
};

module.exports = {
  createVerification,
  getUserVerification,
  getApplications,
  reviewApplication,
};
