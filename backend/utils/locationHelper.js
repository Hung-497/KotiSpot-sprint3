const Property = require("../models/propertyModel");
const mongoose = require("mongoose");
const {
  publicPropertyScope,
} = require("../utils/propertyQueryHelpers");
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap',
}
const geocoder = NodeGeocoder(options);
const getLongLatById = async (req, res) => {
  const { propertyId } = req.params

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }
  try {
    const property = await Property.findOne({
      _id: propertyId,
      ...publicPropertyScope,
    });
    if (property) {
      const details = await geocoder.geocode(property.address);
      res.status(200).json({ latitude: `${details[0].latitude}`, longitude: `${details[0].longitude}` });
    } else {
      res.status(404).json({ message: "Property location not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to geocode property location" });
  }
}

module.exports = {
    getLongLatById,
}