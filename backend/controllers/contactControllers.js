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
    });

    res.status(201).json(contactMessage);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid contact message data",
      });
    }

    res.status(500).json({
      message: "Failed to submit contact message",
    });
  }
};

module.exports = {
  createContactMessage,
};
