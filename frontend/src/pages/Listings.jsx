import { useState } from "react";
import { apiRequest } from "../services/api";
import {
  createEmptyListing,
  validateListing,
  buildPropertyData,
} from "../utils/listingForm";
import { imageToText } from "../utils/imageUtils";

// A listing can have up to 8 photos
const MAX_PHOTOS = 8;

const Listings = () => {
  const [listingType, setListingType] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const [newListing, setNewListing] = useState(createEmptyListing());

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormError("");
    setFormMessage("");

    setNewListing((prevListing) => ({
      ...prevListing,
      [name]: value,
    }));
  };

  const handleFeatureChange = (event) => {
    const { value, checked } = event.target;

    setNewListing((prevListing) => ({
      ...prevListing,
      features: checked
        ? [...prevListing.features, value]
        : prevListing.features.filter((feature) => feature !== value),
    }));
  };

  const addListing = async () => {
    setFormError("");
    setFormMessage("");

    const validationError = validateListing(newListing, listingType);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const propertyData = buildPropertyData(newListing, listingType);

    // Add the photos to the listing. The first photo is the main photo.
    propertyData.images = photoPreviews.map((photo, index) => {
      return {
        id: index + 1,
        url: photo,
        description: `Photo ${index + 1}`,
        isMain: index === 0,
      };
    });

    setIsSubmitting(true);

    try {
      const createdProperty = await apiRequest("/properties", {
        method: "POST",
        body: JSON.stringify(propertyData),
      });

      setFormMessage(
        createdProperty.moderation.status === "approved"
          ? "Listing published successfully."
          : "Listing submitted and is waiting for approval.",
      );

      setPhotoPreviews([]);
      setNewListing(createEmptyListing());
      setListingType("");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleListingType = (event) => {
    setListingType(event.target.value);
  };

  const handlePhotoChange = async (e) => {
    const chosenFiles = Array.from(e.target.files);
    e.target.value = ""; // lets the user choose the same file again later

    // How many more photos can still be added
    const freeSlots = MAX_PHOTOS - photoPreviews.length;

    if (chosenFiles.length > freeSlots) {
      setFormError(`You can have up to ${MAX_PHOTOS} photos.`);
    } else {
      setFormError("");
    }

    try {
      // Turn each chosen file into text so it can be saved with the listing
      const newPhotos = [];

      for (const file of chosenFiles.slice(0, freeSlots)) {
        const photo = await imageToText(file);
        newPhotos.push(photo);
      }

      // Add the new photos AFTER the ones already chosen
      setPhotoPreviews([...photoPreviews, ...newPhotos]);
    } catch (error) {
      setFormError(error.message);
    }
  };

  const removePhoto = (indexToRemove) => {
    const remainingPhotos = photoPreviews.filter(
      (photo, index) => index !== indexToRemove,
    );
    setPhotoPreviews(remainingPhotos);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mt-4 text-3xl font-bold text-[#08243f]">
          Create property listing
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to list your property.
        </p>

        {formError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        {formMessage && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {formMessage}
          </p>
        )}

        {/* LISTING PURPOSE */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-[#08243f]">Listing purpose</h2>

          <div className="mt-4 flex gap-10">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="sale"
                checked={listingType === "sale"}
                onChange={handleListingType}
              />
              For sale
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="rent"
                checked={listingType === "rent"}
                onChange={handleListingType}
              />
              For rent
            </label>
          </div>
        </div>

        {/* PROPERTY INFORMATION */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 font-semibold text-[#08243f]">
            Property information
          </h2>

          {/* Title + location */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">Title *</label>

              <input
                type="text"
                name="title"
                value={newListing.title}
                onChange={handleInputChange}
                placeholder="e.g. Modern 2-bedroom apartment"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Location *</label>

              <input
                type="text"
                name="location"
                value={newListing.location}
                onChange={handleInputChange}
                placeholder="e.g. Helsinki, Finland"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
              />
            </div>
          </div>

          {/* Address + postal */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">Address *</label>

              <input
                type="text"
                name="address"
                value={newListing.address}
                onChange={handleInputChange}
                placeholder="Street address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Postal code *</label>

              <input
                type="text"
                name="postalCode"
                value={newListing.postalCode}
                onChange={handleInputChange}
                placeholder="e.g. 00100"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
              />
            </div>
          </div>

          {/* Main property details */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm">Property type *</label>

              <select
                name="propertyType"
                value={newListing.propertyType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="detached-house">Detached house</option>
                <option value="studio">Studio</option>
                <option value="semi-detached-house">Semi-detached house</option>
                <option value="terraced-house">Terraced house</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">Bedrooms *</label>

              <input
                type="number"
                name="bedrooms"
                value={newListing.bedrooms}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Bathrooms *</label>

              <input
                type="number"
                name="bathrooms"
                value={newListing.bathrooms}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Size (m²) *</label>

              <input
                type="number"
                name="size"
                value={newListing.size}
                onChange={handleInputChange}
                placeholder="55"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
              />
            </div>
          </div>

          {/* Rooms */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">Rooms *</label>

              <input
                type="number"
                name="rooms"
                value={newListing.rooms}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
              />
            </div>
          </div>

          {/* Features */}
          <div className="mt-5">
            <label className="mb-3 block text-sm">Features *</label>

            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="balcony"
                  checked={newListing.features.includes("balcony")}
                  onChange={handleFeatureChange}
                />
                Balcony
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="elevator"
                  checked={newListing.features.includes("elevator")}
                  onChange={handleFeatureChange}
                />
                Elevator
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="parking"
                  checked={newListing.features.includes("parking")}
                  onChange={handleFeatureChange}
                />
                Parking
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="furnished"
                  checked={newListing.features.includes("furnished")}
                  onChange={handleFeatureChange}
                />
                Furnished
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="petsAllowed"
                  checked={newListing.features.includes("petsAllowed")}
                  onChange={handleFeatureChange}
                />
                Pets allowed
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="sauna"
                  checked={newListing.features.includes("sauna")}
                  onChange={handleFeatureChange}
                />
                Sauna
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm">Description *</label>

            <textarea
              value={newListing.description}
              name="description"
              onChange={handleInputChange}
              placeholder="Describe your property..."
              rows="4"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
            />
          </div>
        </div>

        {/* RENTAL DETAILS */}
        {listingType === "rent" && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 font-semibold text-[#08243f]">
              Rental details
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Monthly rent (€) *</label>

                <input
                  type="text"
                  value={newListing.monthlyRent}
                  name="monthlyRent"
                  onChange={handleInputChange}
                  placeholder="e.g. 1200"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Available from *</label>

                <input
                  type="date"
                  value={newListing.availableFrom}
                  name="availableFrom"
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Security deposit (€)
                </label>

                <input
                  type="text"
                  value={newListing.securityDeposit}
                  name="securityDeposit"
                  onChange={handleInputChange}
                  placeholder="e.g. 2400"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Minimum rental period *
                </label>

                <select
                  value={newListing.minimumRentalPeriod}
                  name="minimumRentalPeriod"
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                >
                  <option value="">Select rental period *</option>
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Additional costs / Utilities (€)
                </label>

                <input
                  type="text"
                  value={newListing.additionalCosts}
                  name="additionalCosts"
                  onChange={handleInputChange}
                  placeholder="e.g. 40 €/month"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* SALE DETAILS */}
        {listingType === "sale" && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 font-semibold text-[#08243f]">Sale details</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Price (€) *</label>

                <input
                  type="number"
                  min="1"
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  placeholder="e.g. 350000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* PHOTOS */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-[#08243f]">Property photos</h2>

          <label
            className="
                            mt-4
                            flex cursor-pointer
                            items-center justify-center
                            rounded-lg
                            border-2 border-dashed border-gray-300
                            py-6
                            text-sm
                            text-[#08243f]
                            hover:bg-gray-50
                        "
          >
            {photoPreviews.length >= MAX_PHOTOS
              ? `Maximum of ${MAX_PHOTOS} photos reached`
              : `+ Add photos (${photoPreviews.length}/${MAX_PHOTOS})`}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={photoPreviews.length >= MAX_PHOTOS}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          <p className="mt-2 text-xs text-gray-500">
            Choose up to {MAX_PHOTOS} photos. The first photo is the main
            photo of the listing.
          </p>

          {/* Image previews */}
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {photoPreviews.length > 0 ? (
              photoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Property preview ${index + 1}`}
                    className={`h-32 w-full rounded-lg object-cover ${
                      index === 0 ? "ring-2 ring-[#17634f]" : ""
                    }`}
                  />

                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#17634f] px-2 py-0.5 text-xs font-medium text-white">
                      Main photo
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={`Remove photo ${index + 1}`}
                    onClick={() => removePhoto(index)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-sm text-gray-700 shadow hover:bg-red-50 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <>
                {[1, 2, 3, 4].map((placeholder) => (
                  <div
                    key={placeholder}
                    className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400"
                  >
                    Image placeholder
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addListing}
            disabled={isSubmitting}
            className="
                            rounded-lg
                            bg-[#17634f]
                            px-8 py-3
                            text-sm
                            font-medium
                            text-white
                            hover:bg-[#12503f]
                            disabled:opacity-60
                        "
          >
            {isSubmitting ? "Publishing..." : "Publish listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listings;
