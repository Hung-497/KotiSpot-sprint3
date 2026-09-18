const express = require("express");
const {
  getModerationCandidates,
  updateModerationStatus,
} = require("../controllers/moderationControllers");

const router = express.Router();

router.get("/properties", getModerationCandidates);
router.patch("/properties/:propertyId", updateModerationStatus);

module.exports = router;
