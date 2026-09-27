const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// GET /users for all users
router.get("/", requireAuth, requireRole("administrator"), getAllUsers);

// GET /users/me
router.get("/me", requireAuth, getCurrentUser);

// PATCH /users/me
router.patch("/me", requireAuth, updateUser);

// DELETE /users/me
router.delete("/me", requireAuth, deleteUser);

module.exports = router;
