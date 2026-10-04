import { useState } from "react";
import { apiRequest } from "../services/api";
import {
  createEmptyListing,
  validateListing,
  buildPropertyData,
} from "../utils/listingForm";
import { toPropertyImages } from "../utils/imageUtils";
import PhotoManager from "../components/PhotoManager";
// import { Calculator } from "lucide-react";

const Listings = () => {
  const [listingType, setListingType] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);

  //Estimation variables
  const [estimate, setEstimate] = useState(0);
  const [growth, setGrowth] = useState(0);
  const modifiers = ["postalCode", "propertyType", "size", "rooms", "buildingYear"];

  const [newListing, setNewListing] = useState(createEmptyListing());

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormError("");
    setFormMessage("");

    setNewListing((prevListing) => ({
      ...prevListing,
      [name]: value,
    }));
    if(modifiers.includes(name)){
      setEstimate(0);
      setGrowth(0);
    }
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

  //Estimate functions
  const calculateEstimate = async () => {
    try {
      const proposedEstimate = await apiRequest(`/estimate`, {
        method: "POST",
        body: JSON.stringify({
          postalCode: newListing.postalCode, 
          size: Number(newListing.size), 
          rooms: Number(newListing.rooms), 
          buildingYear: Number(newListing.buildingYear), 
          buildingType: newListing.propertyType,
        }),
      });
      const proposedGrowth = await apiRequest(`/estimate/growth`, {
        method: "POST",
        body: JSON.stringify({
          postalCode: newListing.postalCode,
        }),
      });
      setEstimate(proposedEstimate.estimate);
      setGrowth(proposedGrowth.annualGrowthPct)
    } catch (error) {
      console.error("Error getting estimate:", error);
      alert("Estimation is currently unavailable, please try again later");
    }
  };

  const applyEstimate = () => {
    setFormError("");
    setFormMessage("");

    setNewListing((prevListing) => ({
      ...prevListing,
      ["price"]: estimate,
    }));
  }

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
              <label className="mb-2 block text-sm">Year of construction *</label>
              <input
                type="number"
                name="buildingYear"
                value={newListing.buildingYear}
                onChange={handleInputChange}
                placeholder="1970"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
              />
            </div>
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
                { newListing.postalCode && 
                  newListing.propertyType && 
                  newListing.size && 
                  newListing.rooms && 
                  newListing.buildingYear && 
                  (estimate ?
                    <>
                    <div>
                      <label className="mb-2 block text-sm">Price estimate (click to apply) (€) *</label>
                      <button
                        title="Estimation of current price and predicted annual growth per next 5 years"
                        type="button"
                        onClick={applyEstimate}
                        className="
                          w-full
                          items-center justify-center gap-2
                          rounded-lg
                          border border-gray-300
                          px-4 py-3
                          text-sm
                          text-[#08243f]
                          transition
                          hover:bg-gray-50
                        "
                      >
                        {Math.trunc((estimate * 0.925) / 1000) * 1000}&nbsp;-&nbsp;{Math.trunc((estimate * 1.075) / 1000) * 1000} €
                        {growth && (
                          <>
                            &nbsp;({growth} %)
                          </>
                        )}

                      </button>
                    </div>
                    </>
                    : (
                      <>
                      <div>
                        <label className="mb-2 block text-sm">Price estimate(€) *</label>
                        <button
                          type="button"
                          onClick={calculateEstimate}
                          className="
                            w-full
                            items-center justify-center gap-2
                            rounded-lg
                            bg-[#08243f]
                            px-4 py-3
                            text-sm font-medium
                            text-white
                            transition
                            hover:bg-[#17634f]
                          "
                        >
                          {/* <Calculator size={18} /> */}
                          <p>Calculate price estimate <sup >AI-powered </sup></p>
                        </button>
                        </div>
                      </>
                    )
                )}
            </div>
          </div>
        )}

        {/* PHOTOS */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-[#08243f]">Property photos</h2>

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
