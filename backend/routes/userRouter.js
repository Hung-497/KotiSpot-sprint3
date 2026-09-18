const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userControllers');

// GET /users for all users
router.get('/', getAllUsers);

// POST /users
router.post('/', createUser);

// GET /users/:userId
router.get('/:userId', getUserById);

// PATCH /users/:userId
router.patch('/:userId', updateUser);

// DELETE /users/:userId
router.delete('/:userId', deleteUser);

module.exports = router;