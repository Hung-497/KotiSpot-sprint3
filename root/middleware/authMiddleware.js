const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { JWT_SECRET } = require("../config/config");
const Property = require("../models/propertyModel");

const requireAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    req.user = user; // Attach the user object to the request for further use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication required" });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

const requireVerifiedSellerOrAgent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const isAdmin = req.user.role === "administrator";
  const isVerifiedSeller =
    ["seller", "agent"].includes(req.user.role) && req.user.verifiedAt;

  if (!isAdmin && !isVerifiedSeller) {
    return res
      .status(403)
      .json({ message: "Verified seller or agent access required" });
  }

  next();
};

const requirePropertyOwner = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.property = property; // Attach the property object to the request for further use

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to check property ownership" });
  }
};

// Like requireAuth, but lets guests through too (req.user stays empty)
const optionalAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer ")) {
    try {
      const { _id } = jwt.verify(authorization.split(" ")[1], JWT_SECRET);
      req.user = await User.findById(_id);
    } catch {
      // Invalid token: continue as a guest
    }
  }

  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  requireVerifiedSellerOrAgent,
  requirePropertyOwner,
};
