const express = require('express');
const router = express.Router();
const {
  getAllFavourites,
  addFavourite,
  deleteFavourite,
} = require('../controllers/favouriteControllers');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /favourites
router.get('/', requireAuth, getAllFavourites);

// POST /favourites/:propertyId
router.post('/:propertyId', requireAuth, addFavourite);

// DELETE /favourites/:propertyId
router.delete('/:propertyId', requireAuth, deleteFavourite);

module.exports = router;
