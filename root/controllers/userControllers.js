const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json(
      users.map((user) => ({
        user,
        permittedActions: User.ROLE_ACTIONS[user.role],
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: req.user,
    permittedActions: User.ROLE_ACTIONS[req.user.role],
  });
};

const updateUser = async (req, res) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      message: "User data is required",
    });
  }

  const editableFields = ["firstName", "lastName", "phone", "bio"];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => editableFields.includes(key)),
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      message: "At least one editable field is required",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      user: updatedUser,
      permittedActions: User.ROLE_ACTIONS[updatedUser.role],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }

    res.status(500).json({
      message: "Failed to update user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

const PREFERENCE_FIELDS = [
  "theme",
  "emailNotifications",
  "marketingEmails",
  "smsNotifications",
];

const VALID_THEMES = ["light", "dark", "system"];

const getUserPreferences = async (req, res) => {
  res.status(200).json({
    preferences: req.user.preferences,
  });
};

const updateUserPreferences = async (req, res) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      message: "Preferences data is required",
    });
  }

  const requestedFields = Object.keys(req.body);

  const invalidField = requestedFields.find(
    (field) => !PREFERENCE_FIELDS.includes(field),
  );

  if (invalidField) {
    return res.status(400).json({
      message: `Invalid preference field: ${invalidField}`,
    });
  }

  if (req.body.theme !== undefined && !VALID_THEMES.includes(req.body.theme)) {
    return res.status(400).json({
      message: "Theme must be light, dark, or system",
    });
  }

  const booleanFields = [
    "emailNotifications",
    "marketingEmails",
    "smsNotifications",
  ];

  const invalidBooleanField = booleanFields.find(
    (field) =>
      req.body[field] !== undefined && typeof req.body[field] !== "boolean",
  );

  if (invalidBooleanField) {
    return res.status(400).json({
      message: `${invalidBooleanField} must be a boolean`,
    });
  }

  try {
    requestedFields.forEach((field) => {
      req.user.preferences[field] = req.body[field];
    });

    await req.user.save();

    res.status(200).json({
      preferences: req.user.preferences,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid preferences data",
      });
    }

    res.status(500).json({
      message: "Failed to update user preferences",
    });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
  getUserPreferences,
  updateUserPreferences,
};
