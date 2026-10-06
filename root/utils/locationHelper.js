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
const { getNearbyPlaces } = require("../services/nearbyPlacesService");
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

// GET /properties/nearby?lat=..&lon=..
// Nearby places are optional extras on the map, so when Overpass is down
// this still answers 200 with an empty list and unavailable: true.
const getNearbyPlacesByLocation = async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (
    req.query.lat === undefined ||
    req.query.lon === undefined ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return res.status(400).json({ message: "Valid lat and lon are required" });
  }

  try {
    const places = await getNearbyPlaces(lat, lon);
    res.status(200).json({ places, unavailable: false });
  } catch (error) {
    console.warn("Nearby places unavailable:", error.failures || error.message);
    res.status(200).json({ places: [], unavailable: true });
  }
};

module.exports = {
    getLongLatById,
    getNearbyPlacesByLocation,
}