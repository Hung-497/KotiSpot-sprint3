const Property = require("../models/propertyModel");
const mongoose = require("mongoose");
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap',
}
const geocoder = NodeGeocoder(options);
const getLongLatById =  (id) => {
  const propertyId = id

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return null;
  }
  try {
    const property = Property.findOne({
      _id: propertyId,
      ...publicPropertyScope,
    });
    if (property) {
      const details =  geocoder.geocode(property.address);
      const lat = details[0][0][0];
      const long = details[0][0][1];
      const response = [lat, long];
      return response;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

module.exports = {
    getLongLatById,
}