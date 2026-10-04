const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const featuresSchema = new Schema(
  {
    balcony: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    sauna: { type: Boolean, default: false },
  },
  { _id: false },
);

const rentalDetailsSchema = new Schema(
  {
    availableFrom: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)),
        message: "availableFrom must be a valid date in YYYY-MM-DD format",
      },
    },
    deposit: {
      type: Number,
      min: [0, "deposit cannot be negative"],
    },
    minimumRentalPeriod: {
      type: Number,
      required: true,
      min: [1, "minimumRentalPeriod must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "minimumRentalPeriod must be a positive integer",
      },
    },
    additionalCosts: {
      type: String,
      validate: {
        validator: (value) => value === undefined || value.trim() !== "",
        message: "additionalCosts must not be empty",
      },
    },
  },
  { _id: false },
);

// Image limits (the frontend uses the same numbers)
const MAX_IMAGES = 8;
const MAX_IMAGE_DESCRIPTION_LENGTH = 200;
// A photo saved inside the listing is about 750 KB at most, so 8 photos
// still fit in one request (the JSON body limit is 10 MB)
const MAX_IMAGE_DATA_URL_LENGTH = 1_000_000;
const MAX_IMAGE_WEB_URL_LENGTH = 2048;

const imageDataUrlPattern = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

// An image is either a JPEG/PNG/WebP photo saved as a data URL, or a link
// to an image on the web (http/https). Anything else, like "javascript:"
// or "data:text/html", is rejected.
const isValidImageUrl = (value) => {
  if (value.startsWith("data:")) {
    return (
      value.length <= MAX_IMAGE_DATA_URL_LENGTH &&
      imageDataUrlPattern.test(value)
    );
  }

  if (value.length > MAX_IMAGE_WEB_URL_LENGTH) {
    return false;
  }

  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const strictImageNumberCast = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "number") {
    throw new mongoose.Error.CastError("Number", value, "images.id");
  }

  return value;
};

const strictImageStringCast = (path) => (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "string") {
    throw new mongoose.Error.CastError("String", value, `images.${path}`);
  }

  return value;
};

const strictImageBooleanCast = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "boolean") {
    throw new mongoose.Error.CastError("Boolean", value, "images.isMain");
  }

  return value;
};

const imageSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      min: [1, "image id must be a positive integer"],
      cast: strictImageNumberCast,
      validate: {
        validator: Number.isInteger,
        message: "image id must be a positive integer",
      },
    },
    url: {
      type: String,
      required: true,
      trim: true,
      cast: strictImageStringCast("url"),
      validate: [
        {
          validator: (value) => value.trim() !== "",
          message: "image url must not be blank",
        },
        {
          validator: isValidImageUrl,
          message:
            "image must be a JPEG, PNG, or WebP photo under 750 KB, or an http(s) image link",
        },
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      cast: strictImageStringCast("description"),
      maxlength: [
        MAX_IMAGE_DESCRIPTION_LENGTH,
        `image description cannot exceed ${MAX_IMAGE_DESCRIPTION_LENGTH} characters`,
      ],
      validate: {
        validator: (value) => value.trim() !== "",
        message: "image description must not be blank",
      },
    },
    isMain: {
      type: Boolean,
      required: true,
      cast: strictImageBooleanCast,
    },
  },
  { _id: false },
);

const moderationSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["unreviewed", "flagged", "approved", "removed"],
      default: "unreviewed", 
    },
    reason: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => value === undefined || value.trim() !== "",
        message: "moderation reason must not be blank",
      },
    },
    moderatedAt: {
      type: Date,
    },
  },
  { _id: false },
);

const propertySchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    listingType: {
      type: String,
      required: true,
      enum: ["sale", "rent"],
    },
    propertyType: { type: String, required: true, trim: true },
    propertySubType: { type: String, required: true, trim: true },
    price: {
      type: Number,
      required: true,
      min: [0, "price must be positive"],
      validate: {
        validator: (value) => value > 0,
        message: "price must be positive",
      },
    },
    currency: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    rooms: {
      type: Number,
      required: true,
      min: [1, "rooms must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "rooms must be a positive integer",
      },
    },
    bedrooms: {
      type: Number,
      required: true,
      min: [0, "bedrooms cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "bedrooms must be a non-negative integer",
      },
    },
    bathrooms: {
      type: Number,
      required: true,
      min: [0, "bathrooms cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "bathrooms must be a non-negative integer",
      },
    },
    size: {
      type: Number,
      required: true,
      min: [0, "size must be positive"],
      validate: {
        validator: (value) => value > 0,
        message: "size must be positive",
      },
    },
    buildingYear: {
      type: Number,
      required: true,
      min: [0, "buildingYear must be positive"],
      max: [2026, "buildingYear exceeds current year"],
      validate: {
        validator: Number.isInteger,
        message: "buildingYear must be a non-negative integer",
      },
    },
    features: {
      type: featuresSchema,
      default: () => ({}),
    },
    rentalDetails: {
      type: rentalDetailsSchema,
      required: function () {
        return this.listingType === "rent";
      },
      validate: {
        validator: function (value) {
          return this.listingType === "rent" || value === undefined;
        },
        message: "rentalDetails are only valid for rental properties",
      },
    },
    images: {
      type: [imageSchema],
      default: [],
      validate: [
        {
          validator: (images) =>
            Array.isArray(images) && images.length <= MAX_IMAGES,
          message: `a listing can have up to ${MAX_IMAGES} images`,
        },
        {
          validator: (images) => {
            if (!Array.isArray(images)) {
              return false;
            }

            if (images.length === 0) {
              return true;
            }

            const mainImageCount = images.filter((image) => image.isMain).length;
            const imageIds = images.map((image) => image.id);

            return (
              mainImageCount === 1 && new Set(imageIds).size === imageIds.length
            );
          },
          message:
            "images must contain exactly one main image and unique image ids",
        },
      ],
    },
    moderation: {
      type: moderationSchema,
      default: () => ({ status: "unreviewed" }), 
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "sold", "rented"],
    },
  },
  { timestamps: true },
);

propertySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
