const express = require("express");
const router = express.Router();

const {
  createInquiry,
} = require("../controllers/inquiryControllers");

router.post("/:propertyId", createInquiry);

module.exports = router;