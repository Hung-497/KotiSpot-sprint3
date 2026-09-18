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

module.exports = {
  addNumericRangeFilter,
  addBooleanFilter,
};
