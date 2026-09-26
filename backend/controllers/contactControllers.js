const ContactMessage = require("../models/contactMessageModel");

const createContactMessage = async (req, res) => {
  const { fullName, email, subject, message } = req.body ?? {};

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !fullName.trim() ||
    !email.trim() ||
    !subject.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      message: "Full name, email, subject, and message are required",
    });
  }

  try {
    const contactMessage = await ContactMessage.create({
      fullName,
      email,
      subject,
      message,
      user: req.user?._id,
    });

    res.status(201).json(contactMessage);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid contact message data",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to submit contact message",
    });
  }
};

// GET /contact-messages (admin: all messages, answered or not, until the admin deletes them)
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({
      deletedByAdmin: { $ne: true },
    }).sort({ submittedAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve contact messages" });
  }
};

// POST /contact-messages/:messageId/replies
// The admin or the user who sent the message adds a reply.
const addContactReply = async (req, res) => {
  const { text } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "Reply is required" });
  }

  try {
    const contactMessage = await ContactMessage.findById(req.params.messageId);

    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    const isAdmin = req.user.role === "administrator";
    const isSender = String(contactMessage.user) === String(req.user._id);

    let update;

    if (isAdmin) {
      update = {
        $push: { replies: { from: "admin", text } },
        $set: { deletedByUser: false }, // show it again to the user
      };
    } else if (isSender) {
      update = {
        $push: { replies: { from: "user", text } },
        $set: { deletedByAdmin: false }, // show it again to the admin
      };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only the changed fields are saved (old data in the document can't block it)
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      contactMessage._id,
      update,
      { returnDocument: "after", runValidators: true },
    );

    res.status(201).json(updatedMessage);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    res.status(500).json({ message: "Failed to send reply" });
  }
};

// GET /contact-messages/mine (my messages that the admin has answered)
const getMyMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({
      user: req.user._id,
      "replies.0": { $exists: true }, // has at least one reply
      deletedByUser: { $ne: true },
    }).sort({ submittedAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve your messages" });
  }
};

// DELETE /contact-messages/:messageId (user removes it from their notifications)
const deleteMessageForUser = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.messageId);

    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    if (String(contactMessage.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only this one field is saved (old data in the document can't block it)
    await ContactMessage.updateOne(
      { _id: contactMessage._id },
      { $set: { deletedByUser: true } },
    );

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// DELETE /contact-messages/:messageId/admin (admin removes it from their notifications)
const deleteMessageForAdmin = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.messageId);

    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Only this one field is saved (old data in the document can't block it)
    await ContactMessage.updateOne(
      { _id: contactMessage._id },
      { $set: { deletedByAdmin: true } },
    );

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    res.status(500).json({ message: "Failed to delete notification" });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  addContactReply,
  getMyMessages,
  deleteMessageForUser,
  deleteMessageForAdmin,
};
