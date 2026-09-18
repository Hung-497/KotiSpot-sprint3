const express = require('express');
const router = express.Router();
const {
  createVerification,
  getUserVerification,
  getApplications,
  reviewApplication,
} = require("../controllers/verificationControllers");

// Route to create a new verification request
router.post("/:userId", createVerification);

// Route to get the latest verification request for a specific user
router.get("/user/:userId", getUserVerification);

// Route to get all verification applications, optionally filtered by status
router.get("/", getApplications);

// Route to review a specific verification application (approve/reject)
router.patch("/:applicationId", reviewApplication);

module.exports = router;
