const addNumericRangeFilter = (query, field, rawMin, rawMax) => {
  const range = {};

  if (rawMin !== undefined) {
    if (typeof rawMin !== "string" || rawMin.trim() === "") {
      return `Invalid ${field} minimum value`;
    }

    const min = Number(rawMin);
    if (!Number.isFinite(min)) {
      return `Invalid ${field} minimum value`;
    }
    range.$gte = min;
  }

  if (rawMax !== undefined) {
    if (typeof rawMax !== "string" || rawMax.trim() === "") {
      return `Invalid ${field} maximum value`;
    }

    const max = Number(rawMax);
    if (!Number.isFinite(max)) {
      return `Invalid ${field} maximum value`;
    }
    range.$lte = max;
  }

  if (range.$gte !== undefined && range.$lte !== undefined && range.$gte > range.$lte) {
    return `Invalid ${field} range`;
  }

  if (Object.keys(range).length > 0) {
    query[field] = range;
  }

  return null;
};

const addBooleanFilter = (query, field, rawValue) => {
  if (rawValue === undefined) {
    return null;
  }

  if (rawValue === "true") {
    query[`features.${field}`] = true;
    return null;
  }

  if (rawValue === "false") {
    query[`features.${field}`] = false;
    return null;
  }

  return `Invalid ${field} value`;
};

// Case-insensitive "contains" match of the text in any of the given fields.
// The text is escaped so characters like "." or "(" are matched literally.
const buildTextMatch = (text, fields) => {
  const pattern = text.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: pattern, $options: "i" },
    })),
  };
};

// Listings anyone can see: active and approved by moderation
const publicPropertyScope = {
  status: "active",
  "moderation.status": "approved",
};

module.exports = {
  publicPropertyScope,
  addNumericRangeFilter,
  addBooleanFilter,
  buildTextMatch,
};
