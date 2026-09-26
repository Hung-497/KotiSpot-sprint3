const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getContactMessages,
  addContactReply,
  getMyMessages,
  deleteMessageForUser,
  deleteMessageForAdmin,
} = require("../controllers/contactControllers");
const {
  requireAuth,
  optionalAuth,
  requireRole,
} = require("../middleware/authMiddleware");

// POST /contact-messages
router.post("/", optionalAuth, createContactMessage);

// GET /contact-messages (admin: all messages until the admin deletes them)
router.get("/", requireAuth, requireRole("administrator"), getContactMessages);

// GET /contact-messages/mine (my messages that the admin has answered)
router.get("/mine", requireAuth, getMyMessages);

// POST /contact-messages/:messageId/replies (admin or user replies - as many times as they want)
router.post("/:messageId/replies", requireAuth, addContactReply);

// DELETE /contact-messages/:messageId (user removes it from their notifications)
router.delete("/:messageId", requireAuth, deleteMessageForUser);

// DELETE /contact-messages/:messageId/admin (admin removes it from their notifications)
router.delete(
  "/:messageId/admin",
  requireAuth,
  requireRole("administrator"),
  deleteMessageForAdmin,
);

module.exports = router;
