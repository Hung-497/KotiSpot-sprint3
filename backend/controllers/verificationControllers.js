const Verification = require("../models/verificationModel");
const User = require("../models/userModel");

const createVerification = async (req, res) => {
  try {
    const existingRequest = await Verification.findOne({
      user: req.user._id,
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

    // Sellers can only upgrade to agent; agents and admins can't apply
    if (req.user.role === "seller" && role !== "agent") {
      return res.status(400).json({
        message: "You are already a seller. You can only apply to be an agent",
      });
    }

    if (["agent", "administrator"].includes(req.user.role)) {
      return res.status(400).json({
        message: "Your account cannot apply for a new role",
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
      user: req.user._id,
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
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid verification request data" });
    }

    res.status(500).json({ message: "Failed to create verification request" });
  }
};

const getUserVerification = async (req, res) => {
  try {
    const verificationRequest = await Verification.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!verificationRequest) {
      return res
        .status(404)
        .json({ message: "Verification request not found for this user" });
    }

    res.status(200).json(verificationRequest);
  } catch (error) {
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
    // Don't return applications the admin has deleted from notifications
    const filter = { deletedByAdmin: { $ne: true } };
    if (status) {
      filter.status = status;
    }

    const applications = await Verification.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve verification applications",
    });
  }
};

const reviewApplication = async (req, res) => {
  const { applicationId } = req.params;

  const { status, reviewNote, rejectionReason } = req.body ?? {};

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be either "approved" or "rejected".',
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
    verificationRequest.reviewedBy = req.user._id;
    verificationRequest.reviewedAt = new Date();
    verificationRequest.reviewNote = reviewNote || undefined;

    verificationRequest.rejectionReason =
      status === "rejected" ? rejectionReason.trim() : undefined;

    await verificationRequest.save();

    if (status === "approved") {
      await User.findByIdAndUpdate(
        verificationRequest.user,
        { role: verificationRequest.role, verifiedAt: new Date() },
        { returnDocument: "after", runValidators: true },
      );
    }

    res.status(200).json(verificationRequest);
  } catch (error) {
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

// DELETE /verifications/:applicationId (admin removes it from their notifications)
const deleteApplicationNotification = async (req, res) => {
  try {
    const application = await Verification.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only this one field is saved (old data in the document can't block it)
    await Verification.updateOne(
      { _id: application._id },
      { $set: { deletedByAdmin: true } },
    );

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    res.status(500).json({ message: "Failed to delete notification" });
  }
};

module.exports = {
  createVerification,
  getUserVerification,
  getApplications,
  reviewApplication,
  deleteApplicationNotification,
};
