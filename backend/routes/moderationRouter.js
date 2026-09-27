const express = require("express");
const {
  getModerationCandidates,
  updateModerationStatus,
} = require("../controllers/moderationControllers");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("administrator"));

router.get("/properties", getModerationCandidates);
router.patch("/properties/:propertyId", updateModerationStatus);

module.exports = router;
