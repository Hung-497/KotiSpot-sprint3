const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  requestCode,
  verifyCode,
  getCurrentUser,
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

router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
