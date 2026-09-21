const express = require('express');
const router = express.Router();
const {
  requestCode,
  verifyCode,
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

// POST /request-code
router.post('/request-code', requestCode);

// POST /verify-code
router.post('/verify-code', verifyCode);

module.exports = router;
