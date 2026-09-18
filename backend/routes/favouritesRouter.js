const express = require('express');
const router = express.Router();
const {
  getAllFavourites,
  addFavourite,
  deleteFavourite,
} = require('../controllers/favouriteControllers');

// GET /favourites/:userId
router.get('/:userId', getAllFavourites);

// POST /favourites/:userId/:propertyId
router.post('/:userId/:propertyId', addFavourite);

// DELETE /favourites/:userId/:propertyId
router.delete('/:userId/:propertyId', deleteFavourite);

module.exports = router;
