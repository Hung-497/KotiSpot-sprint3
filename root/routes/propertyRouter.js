const express = require("express");
const router = express.Router();
const {
  getActiveProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  filterProperties,
  getPropertyByKeyword,
  getMyProperties,
} = require("../controllers/propertyControllers");
const {
  getLongLatById,
  getNearbyPlacesByLocation,
} = require("../utils/locationHelper");
const { reportProperty } = require("../controllers/moderationControllers");
const {
  requireAuth,
  requireRole,
  requireVerifiedSellerOrAgent,
  requirePropertyOwner,
} = require("../middleware/authMiddleware");

// GET /properties for active properties
router.get("/", getActiveProperties);

// GET /properties for all properties
router.get("/all", requireAuth, requireRole("administrator"), getAllProperties);

// POST /properties
router.post("/", requireAuth, requireVerifiedSellerOrAgent, createProperty);

// GET /properties/mine
router.get("/mine", requireAuth, getMyProperties);

// GET /properties/filter
router.get("/filter", filterProperties);

//GET /properties/search
router.get("/search", getPropertyByKeyword);

// GET /properties/nearby?lat=..&lon=..
router.get("/nearby", getNearbyPlacesByLocation);

//GET /properties/geocode/:propertyId
router.get("/geocode/:propertyId", getLongLatById)

// GET /properties/:propertyId
router.get("/:propertyId", getPropertyById);

// POST /properties/:propertyId/report
router.post("/:propertyId/report", requireAuth, reportProperty);

// PATCH /properties/:propertyId
router.patch(
  "/:propertyId",
  requireAuth,
  requireVerifiedSellerOrAgent,
  requirePropertyOwner,
  updateProperty,
);

// DELETE /properties/:propertyId
router.delete(
  "/:propertyId",
  requireAuth,
  requireVerifiedSellerOrAgent,
  requirePropertyOwner,
  deleteProperty,
);

module.exports = router;
