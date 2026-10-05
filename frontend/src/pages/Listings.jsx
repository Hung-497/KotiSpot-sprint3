import SavingOverlay from "../components/SavingOverlay";
import { useState } from "react";
import { apiRequest } from "../services/api";
import {
  createEmptyListing,
  validateListing,
  buildPropertyData,
} from "../utils/listingForm";
import { toPropertyImages } from "../utils/imageUtils";
import PhotoManager from "../components/PhotoManager";

const Listings = () => {
  const [listingType, setListingType] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);

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

    // Add the photos to the listing, in order, with the chosen main photo
    propertyData.images = toPropertyImages(photos, newListing.title);

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

      setPhotos([]);
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

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10" aria-busy={isSubmitting}>
      {isSubmitting && <SavingOverlay label="Publishing listing…" />}
      <div className="mx-auto max-w-6xl">
        <h1 className="ks-page-title mt-4">
          Create property listing
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Fill in the details below to list your property.
        </p>

        {formError && (
          <p
            role="alert"
            className="mt-4 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {formError}
          </p>
        )}

        {formMessage && (
          <p
            role="status"
            className="mt-4 rounded-control bg-pine-50 px-4 py-3 text-sm text-pine-700"
          >
            {formMessage}
          </p>
        )}

        {/* LISTING PURPOSE */}
        <div className="mt-6 rounded-card border border-line bg-surface p-4 sm:p-6">
          <h2 className="font-semibold text-ink">Listing purpose</h2>

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
        <div className="mt-5 rounded-card border border-line bg-surface p-4 sm:p-6">
          <h2 className="mb-5 font-semibold text-ink">
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Bathrooms *</label>

              <input
                type="number"
                name="bathrooms"
                value={newListing.bathrooms}
                onChange={handleInputChange}
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
                className="ks-input w-full border text-sm"
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
              className="ks-input w-full resize-none border text-sm"
            />
          </div>
        </div>

        {/* RENTAL DETAILS */}
        {listingType === "rent" && (
          <div className="mt-5 rounded-card border border-line bg-surface p-4 sm:p-6">
            <h2 className="mb-5 font-semibold text-ink">
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
                  className="ks-input w-full border text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Available from *</label>

                <input
                  type="date"
                  value={newListing.availableFrom}
                  name="availableFrom"
                  onChange={handleInputChange}
                  className="ks-input w-full border text-sm"
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
                  className="ks-input w-full border text-sm"
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
                  className="ks-input w-full border text-sm"
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
                  className="ks-input w-full border text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* SALE DETAILS */}
        {listingType === "sale" && (
          <div className="mt-5 rounded-card border border-line bg-surface p-4 sm:p-6">
            <h2 className="mb-5 font-semibold text-ink">Sale details</h2>

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
                  className="ks-input w-full border text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* PHOTOS */}
        <div className="mt-5 rounded-card border border-line bg-surface p-4 sm:p-6">
          <h2 className="font-semibold text-ink">Property photos</h2>

          <PhotoManager
            photos={photos}
            onChange={setPhotos}
            listingTitle={newListing.title}
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addListing}
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listings;
