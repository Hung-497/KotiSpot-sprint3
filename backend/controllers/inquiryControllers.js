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
      owner: property.owner,
      sender: req.user?._id,
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

// GET /inquiries/mine (inquiries about the logged-in user's listings)
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      owner: req.user._id,
      deletedByOwner: { $ne: true }, // also matches old inquiries without this field
    })
      .populate("propertyId", "title address city")
      .sort({ submittedAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve inquiries",
    });
  }
};

// GET /inquiries/sent (inquiries I sent that the owner has answered)
const getMySentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      sender: req.user._id,
      "replies.0": { $exists: true }, // has at least one reply
      deletedBySender: { $ne: true },
    })
      .populate("propertyId", "title address city")
      .sort({ submittedAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve your inquiries",
    });
  }
};

// POST /inquiries/:inquiryId/replies
// The listing owner or the person who sent the inquiry adds a reply.
const addInquiryReply = async (req, res) => {
  const { text } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "Reply is required" });
  }

  try {
    const inquiry = await Inquiry.findById(req.params.inquiryId);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const userId = String(req.user._id);
    let update;

    if (String(inquiry.owner) === userId) {
      update = {
        $push: { replies: { from: "owner", text } },
        $set: { deletedBySender: false }, // show it again to the other person
      };
    } else if (String(inquiry.sender) === userId) {
      update = {
        $push: { replies: { from: "sender", text } },
        $set: { deletedByOwner: false }, // show it again to the other person
      };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only the changed fields are saved (old data in the document can't block it)
    const updatedInquiry = await Inquiry.findByIdAndUpdate(inquiry._id, update, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(201).json(updatedInquiry);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid inquiry ID" });
    }

    res.status(500).json({ message: "Failed to send reply" });
  }
};

// DELETE /inquiries/:inquiryId (removes it from MY notifications only)
const deleteInquiryNotification = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.inquiryId);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const userId = String(req.user._id);

    let update;

    if (String(inquiry.owner) === userId) {
      update = { deletedByOwner: true };
    } else if (String(inquiry.sender) === userId) {
      update = { deletedBySender: true };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only this one field is saved (old data in the document can't block it)
    await Inquiry.updateOne({ _id: inquiry._id }, { $set: update });

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid inquiry ID" });
    }

    res.status(500).json({ message: "Failed to delete notification" });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  addInquiryReply,
  deleteInquiryNotification,
};
