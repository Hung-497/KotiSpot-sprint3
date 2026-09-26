const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  addInquiryReply,
  deleteInquiryNotification,
} = require("../controllers/inquiryControllers");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

// GET /inquiries/mine (inquiries about my listings)
router.get("/mine", requireAuth, getMyInquiries);

// GET /inquiries/sent (inquiries I sent that have been answered)
router.get("/sent", requireAuth, getMySentInquiries);

// POST /inquiries/:inquiryId/replies (owner or sender replies - as many times as they want)
router.post("/:inquiryId/replies", requireAuth, addInquiryReply);

// DELETE /inquiries/:inquiryId (remove it from my notifications)
router.delete("/:inquiryId", requireAuth, deleteInquiryNotification);

// POST /inquiries/:propertyId
router.post("/:propertyId", optionalAuth, createInquiry);

module.exports = router;
