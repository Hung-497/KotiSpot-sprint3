const express = require("express");
const router = express.Router();

const {
  createContactMessage,
} = require("../controllers/contactControllers");

// POST /contact-messages
router.post("/", createContactMessage);

module.exports = router;
