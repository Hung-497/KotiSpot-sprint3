const User = require("../models/userModel");

const parseUserId = (value) => {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

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
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const createUser = async (req, res) => {
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

  try {
    const user = await User.create(req.body);

    res
      .status(201)
      .json({ user, permittedActions: User.ROLE_ACTIONS[user.role] });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User ID or email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ user, permittedActions: User.ROLE_ACTIONS[user.role] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};

const updateUser = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

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

  const { userId: ignoredUserId, ...updates } = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      message: "At least one editable user field is required",
    });
  }

  try {
    const updatedUser = await User.findOneAndUpdate({ userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: updatedUser,
      permittedActions: User.ROLE_ACTIONS[updatedUser.role],
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User ID or email already exists",
      });
    }

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
  const userId = parseUserId(req.params.userId);

  if (userId === null) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
