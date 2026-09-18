const express = require('express');
const router = express.Router();
const {
  simulateLogin,
  simulateRegistration,
  simulateLogout,
} = require('../controllers/loginControllers');

// POST /login
router.post('/login', simulateLogin);

// POST /register
router.post('/register', simulateRegistration);

// POST /logout
router.post('/logout', simulateLogout);

module.exports = router;
