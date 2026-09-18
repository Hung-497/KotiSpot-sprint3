const express = require('express');
const router = express.Router();
const {
  getActiveProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  filterProperties,
  getPropertyByKeyword
} = require('../controllers/propertyControllers');

// GET /properties for active properties
router.get('/', getActiveProperties);

// GET /properties for all properties
router.get('/all', getAllProperties);

// POST /properties
router.post('/', createProperty);

// GET /properties/filter 
router.get('/filter', filterProperties);

//GET /properties/search
router.get('/search', getPropertyByKeyword);

// GET /properties/:propertyId
router.get('/:propertyId', getPropertyById);

// PATCH /properties/:propertyId
router.patch('/:propertyId', updateProperty);

// DELETE /properties/:propertyId
router.delete('/:propertyId', deleteProperty);

module.exports = router;