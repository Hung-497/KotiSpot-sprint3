export const createEmptyListing = () => ({
  title: "",
  location: "",
  address: "",
  postalCode: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  size: "",
  rooms: "",
  features: [],
  description: "",
  monthlyRent: "",
  availableFrom: "",
  securityDeposit: "",
  minimumRentalPeriod: "",
  additionalCosts: "",
  price: "",
});

export const validateListing = (listing, listingType) => {
  if (!listingType) {
    return "Please choose whether the property is for sale or for rent.";
  }

  const requiredFields = [
    ["title", "title"],
    ["location", "location"],
    ["address", "address"],
    ["postalCode", "postal code"],
    ["propertyType", "property type"],
    ["bedrooms", "bedrooms"],
    ["bathrooms", "bathrooms"],
    ["size", "size"],
    ["rooms", "rooms"],
    ["description", "description"],
  ];

  const missingField = requiredFields.find(
    ([field]) => !String(listing[field]).trim(),
  );

  if (missingField) {
    return `Please fill in the ${missingField[1]} field.`;
  }

  if (
    Number(listing.rooms) < 1 ||
    Number(listing.bedrooms) < 0 ||
    Number(listing.bathrooms) < 0 ||
    Number(listing.size) <= 0
  ) {
    return "Please enter valid property numbers.";
  }

  if (
    listingType === "rent" &&
    (!listing.monthlyRent ||
      !listing.availableFrom ||
      !listing.minimumRentalPeriod)
  ) {
    return "Please complete the required rental details.";
  }

  if (listingType === "sale" && !listing.price) {
    return "Please enter the sale price.";
  }

  const price =
    listingType === "rent"
      ? Number(listing.monthlyRent)
      : Number(listing.price);

  if (price <= 0) {
    return "Price must be greater than 0.";
  }

  return "";
};

export const buildPropertyData = (listing, listingType) => {
  const features = Object.fromEntries(
    [
      "balcony",
      "elevator",
      "parking",
      "furnished",
      "petsAllowed",
      "sauna",
    ].map((feature) => [
      feature,
      listing.features.includes(feature),
    ]),
  );

  const propertyData = {
    title: listing.title.trim(),
    description: listing.description.trim(),
    listingType,
    propertyType: "residential",
    propertySubType: listing.propertyType,
    price:
      listingType === "rent"
        ? Number(listing.monthlyRent)
        : Number(listing.price),
    currency: "EUR",
    city: listing.location.trim(),
    address: listing.address.trim(),
    postalCode: listing.postalCode.trim(),
    rooms: Number(listing.rooms),
    bedrooms: Number(listing.bedrooms),
    bathrooms: Number(listing.bathrooms),
    size: Number(listing.size),
    features,
  };

  if (listingType === "rent") {
    propertyData.rentalDetails = {
      availableFrom: listing.availableFrom,
      minimumRentalPeriod: Number(
        listing.minimumRentalPeriod,
      ),
    };

    if (listing.securityDeposit !== "") {
      propertyData.rentalDetails.deposit =
        Number(listing.securityDeposit);
    }

    if (listing.additionalCosts.trim()) {
      propertyData.rentalDetails.additionalCosts =
        listing.additionalCosts.trim();
    }
  }

  return propertyData;
};