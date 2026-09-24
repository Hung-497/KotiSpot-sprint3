const express = require('express');
const router = express.Router();
const {
  createVerification,
  getUserVerification,
  getApplications,
  reviewApplication,
} = require("../controllers/verificationControllers");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// Route to create a new verification request
router.post("/", requireAuth, createVerification);

// Route to get the verification request for the authenticated user
router.get("/me", requireAuth, getUserVerification);

// Route to get all verification applications, optionally filtered by status
router.get("/", requireAuth, requireRole("administrator"), getApplications);

// Route to review a specific verification application (approve/reject)
router.patch("/:applicationId", requireAuth, requireRole("administrator"), reviewApplication);

module.exports = router;
