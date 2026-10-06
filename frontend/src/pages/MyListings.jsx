import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../services/api";
import useDialog from "../hooks/useDialog";
import houseImage from "../assets/house1.jpg";
import PhotoManager from "../components/PhotoManager";
import PageLoader from "../components/PageLoader";
import SavingOverlay from "../components/SavingOverlay";
import useMinimumDuration, { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
// import { Calculator } from "lucide-react";
import {
  toEditablePhotos,
  toPropertyImages,
  getMainImage,
} from "../utils/imageUtils";

const emptyFeatures = {
  balcony: false,
  elevator: false,
  parking: false,
  furnished: false,
  petsAllowed: false,
  sauna: false,
};

const MyListings = ({ onListingUpdated }) => {
  const { showAlert, showConfirm } = useDialog();
  const hasMinimumLoadingElapsed = useMinimumDuration(PAGE_LOADING_MS);
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [isOpeningEditor, setIsOpeningEditor] = useState(false);
  const editLoadingTimer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  //Estimation variables
  const [estimate, setEstimate] = useState(0);
  const [growth, setGrowth] = useState(0);
  const modifiers = [
    "postalCode",
    "propertySubType",
    "size",
    "rooms",
    "buildingYear",
  ];

  useEffect(() => () => clearTimeout(editLoadingTimer.current), []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await apiRequest("/properties/mine");
        setListings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const startEdit = (listing) => {
    clearTimeout(editLoadingTimer.current);
    setIsOpeningEditor(true);
    setEditingListing({
      ...listing,
      features: {
        ...emptyFeatures,
        ...listing.features,
      },
      rentalDetails: listing.rentalDetails
        ? { ...listing.rentalDetails }
        : null,
      photos: toEditablePhotos(listing.images),
    });

    setError("");
    setEstimate(0);
    setGrowth(0);
    editLoadingTimer.current = setTimeout(() => {
      setIsOpeningEditor(false);
      editLoadingTimer.current = null;
    }, PAGE_LOADING_MS);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditingListing((current) => ({
      ...current,
      [name]: value,
    }));
    if (modifiers.includes(name)) {
      setEstimate(0);
      setGrowth(0);
    }
  };

  const handleFeatureChange = (event) => {
    const { name, checked } = event.target;

    setEditingListing((current) => ({
      ...current,
      features: {
        ...current.features,
        [name]: checked,
      },
    }));
  };

  const handleRentalChange = (event) => {
    const { name, value } = event.target;

    setEditingListing((current) => ({
      ...current,
      rentalDetails: {
        ...current.rentalDetails,
        [name]: value,
      },
    }));
  };

  //Estimate functions
  const calculateEstimate = async () => {
    try {
      const proposedEstimate = await apiRequest(`/estimate`, {
        method: "POST",
        body: JSON.stringify({
          postalCode: editingListing.postalCode,
          size: Number(editingListing.size),
          rooms: Number(editingListing.rooms),
          buildingYear: Number(editingListing.buildingYear),
          buildingType: editingListing.propertySubType,
        }),
      });
      const proposedGrowth = await apiRequest(`/estimate/growth`, {
        method: "POST",
        body: JSON.stringify({
          postalCode: editingListing.postalCode,
        }),
      });
      setEstimate(proposedEstimate.estimate);
      setGrowth(proposedGrowth.annualGrowthPct);
    } catch (error) {
      console.error("Error getting estimate:", error);
      showAlert(
        "Estimation is currently unavailable, please try again later",
        "Estimate unavailable",
      );
    }
  };
  const applyEstimate = () => {
    setEditingListing((current) => ({
      ...current,
      ["price"]: estimate,
    }));
  };
  const saveEdit = async () => {
    if (isSaving) return;

    setError("");

    if (
      !editingListing.title.trim() ||
      !editingListing.description.trim() ||
      !editingListing.city.trim() ||
      !editingListing.address.trim() ||
      !editingListing.postalCode.trim() ||
      !editingListing.propertySubType.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      Number(editingListing.price) <= 0 ||
      Number(editingListing.buildingYear) < 0 ||
      Number(editingListing.buildingYear) > 2026 ||
      Number(editingListing.rooms) < 1 ||
      Number(editingListing.bedrooms) < 0 ||
      Number(editingListing.bathrooms) < 0 ||
      Number(editingListing.size) <= 0
    ) {
      setError("Please enter valid property numbers.");
      return;
    }

    if (
      editingListing.listingType === "rent" &&
      (!editingListing.rentalDetails?.availableFrom ||
        Number(editingListing.rentalDetails?.minimumRentalPeriod) < 1)
    ) {
      setError(
        "Rental listings require an available date and minimum rental period.",
      );
      return;
    }

    const updates = {
      status: editingListing.status,
      title: editingListing.title.trim(),
      description: editingListing.description.trim(),
      propertySubType: editingListing.propertySubType,
      price: Number(editingListing.price),
      city: editingListing.city.trim(),
      address: editingListing.address.trim(),
      postalCode: editingListing.postalCode.trim(),
      buildingYear: Number(editingListing.buildingYear),
      rooms: Number(editingListing.rooms),
      bedrooms: Number(editingListing.bedrooms),
      bathrooms: Number(editingListing.bathrooms),
      size: Number(editingListing.size),
      features: editingListing.features,
      // The whole photo list is saved, so removed photos are gone after saving
      images: toPropertyImages(editingListing.photos, editingListing.title),
    };

    if (editingListing.listingType === "rent") {
      updates.rentalDetails = {
        availableFrom: editingListing.rentalDetails.availableFrom,
        minimumRentalPeriod: Number(
          editingListing.rentalDetails.minimumRentalPeriod,
        ),
      };

      if (
        editingListing.rentalDetails.deposit !== "" &&
        editingListing.rentalDetails.deposit !== undefined
      ) {
        updates.rentalDetails.deposit = Number(
          editingListing.rentalDetails.deposit,
        );
      }

      if (editingListing.rentalDetails.additionalCosts?.trim()) {
        updates.rentalDetails.additionalCosts =
          editingListing.rentalDetails.additionalCosts.trim();
      }
    }

    setIsSaving(true);
    const minimumLoading = new Promise((resolve) =>
      setTimeout(resolve, PAGE_LOADING_MS),
    );

    try {
      const updatedListing = await apiRequest(
        `/properties/${editingListing.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        },
      );

      await minimumLoading;
      setListings((current) =>
        current.map((listing) =>
          listing.id === updatedListing.id ? updatedListing : listing,
        ),
      );

      onListingUpdated(updatedListing);
      setEditingListing(null);
    } catch (error) {
      await minimumLoading;
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteListing = async (propertyId) => {
    const confirmed = await showConfirm({
      title: "Delete listing",
      message:
        "Are you sure you want to delete this listing?\nThis cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/properties/${propertyId}`, {
        method: "DELETE",
      });

      setListings((current) =>
        current.filter((listing) => listing.id !== propertyId),
      );
    } catch (error) {
      showAlert(error.message, "Could not delete listing");
    }
  };

  if (loading || !hasMinimumLoadingElapsed) {
    return <PageLoader label="Loading your listings…" fullPage variant="bar" />;
  }

  if (editingListing) {
    if (isOpeningEditor) {
      return <PageLoader label="Loading edit listing…" fullPage variant="spinner" />;
    }

    return (
      <div
        className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10"
        aria-busy={isSaving}
      >
        {isSaving && <SavingOverlay label="Saving changes…" />}
        <div className="mx-auto max-w-4xl">
          <h1 className="ks-page-title">Edit listing</h1>

          <p className="mt-2 text-sm text-ink-muted">
            Update your property information.
          </p>

          <div className="mt-8 rounded-card border border-line bg-surface p-4 sm:p-8">
            {error && (
              <p className="mb-5 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {/* <div className="md:col-span-2"> */}
              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Listing status
                </label>

                <select
                  name="status"
                  value={editingListing.status}
                  onChange={handleChange}
                  className="ks-input w-full border"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Property type
                </label>

                <select
                  name="propertySubType"
                  value={editingListing.propertySubType}
                  onChange={handleChange}
                  className="ks-input w-full border"
                >
                  <option value="apartment">Apartment</option>

                  <option value="detached-house">Detached house</option>

                  <option value="semi-detached-house">
                    Semi-detached house
                  </option>

                  <option value="terraced-house">Terraced house</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">Title</label>

                <input
                  name="title"
                  value={editingListing.title}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Price (€)
                </label>

                <input
                  name="price"
                  type="number"
                  min="1"
                  value={editingListing.price}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>
              <div>
                {editingListing.listingType !== "rent" &&
                  editingListing.postalCode &&
                  editingListing.propertyType &&
                  editingListing.size &&
                  editingListing.rooms &&
                  editingListing.buildingYear &&
                  (estimate ? (
                    <>
                      <div>
                        <label className="mb-2 block text-sm">
                          Price estimate (click to apply) (€) *
                        </label>
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
                          text-ink
                          transition
                          hover:bg-gray-50
                        "
                        >
                          {Math.trunc((estimate * 0.925) / 1000) * 1000}
                          &nbsp;-&nbsp;
                          {Math.trunc((estimate * 1.075) / 1000) * 1000} €
                          {growth && <>&nbsp;({growth} %)</>}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="mb-2 block text-sm">
                          Price estimate(€) *
                        </label>
                        <button
                          type="button"
                          onClick={calculateEstimate}
                          className="
                            w-full
                            items-center justify-center gap-2
                            rounded-lg
                            bg-pine-700
                            px-4 py-3
                            text-sm font-medium
                            text-white
                            transition
                            hover:bg-[#08243f]
                          "
                        >
                          {/* <Calculator size={18} /> */}
                          <p>
                            Calculate price estimate <sup>AI-powered </sup>
                          </p>
                        </button>
                      </div>
                    </>
                  ))}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">City</label>

                <input
                  name="city"
                  value={editingListing.city}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Address
                </label>

                <input
                  name="address"
                  value={editingListing.address}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Postal code
                </label>

                <input
                  name="postalCode"
                  value={editingListing.postalCode}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Size (m²)
                </label>

                <input
                  name="size"
                  type="number"
                  min="1"
                  value={editingListing.size}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">Rooms</label>

                <input
                  name="rooms"
                  type="number"
                  min="1"
                  step="1"
                  value={editingListing.rooms}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Year of construction
                </label>

                <input
                  name="buildingYear"
                  type="number"
                  min="0"
                  step="1"
                  value={editingListing.buildingYear}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Bedrooms
                </label>

                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  step="1"
                  value={editingListing.bedrooms}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Bathrooms
                </label>

                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="1"
                  value={editingListing.bathrooms}
                  onChange={handleChange}
                  className="ks-input w-full border"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={editingListing.description}
                  onChange={handleChange}
                  className="ks-input w-full resize-none border"
                />
              </div>
            </div>

            <div className="mt-8 border-t pt-6 dark:border-white/10">
              <h2 className="mb-4 text-lg font-semibold text-ink">Features</h2>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {[
                  ["balcony", "Balcony"],
                  ["elevator", "Elevator"],
                  ["parking", "Parking"],
                  ["furnished", "Furnished"],
                  ["petsAllowed", "Pets allowed"],
                  ["sauna", "Sauna"],
                ].map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2 text-sm dark:text-[#d7e1e7]">
                    <input
                      type="checkbox"
                      name={name}
                      checked={editingListing.features?.[name] ?? false}
                      onChange={handleFeatureChange}
                      className="accent-pine-700 dark:accent-[#55d4aa]"
                    />

                    {label}
                  </label>
                ))}
              </div>
            </div>

            {editingListing.listingType === "rent" && (
              <div className="mt-8 border-t pt-6 dark:border-white/10">
                <h2 className="mb-5 text-lg font-semibold text-ink">
                  Rental details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                      Available from
                    </label>

                    <input
                      name="availableFrom"
                      type="date"
                      value={editingListing.rentalDetails?.availableFrom || ""}
                      onChange={handleRentalChange}
                      className="ks-input w-full border"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                      Minimum rental period
                    </label>

                    <input
                      name="minimumRentalPeriod"
                      type="number"
                      min="1"
                      step="1"
                      value={
                        editingListing.rentalDetails?.minimumRentalPeriod ?? ""
                      }
                      onChange={handleRentalChange}
                      className="ks-input w-full border"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                      Deposit (€)
                    </label>

                    <input
                      name="deposit"
                      type="number"
                      min="0"
                      value={editingListing.rentalDetails?.deposit ?? ""}
                      onChange={handleRentalChange}
                      className="ks-input w-full border"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium dark:text-[#d7e1e7]">
                      Additional costs
                    </label>

                    <input
                      name="additionalCosts"
                      value={
                        editingListing.rentalDetails?.additionalCosts || ""
                      }
                      onChange={handleRentalChange}
                      className="ks-input w-full border"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 border-t pt-6 dark:border-white/10">
              <h2 className="font-semibold text-ink">Property photos</h2>

              <PhotoManager
                photos={editingListing.photos}
                onChange={(photos) =>
                  setEditingListing((current) => ({
                    ...current,
                    photos,
                  }))
                }
                listingTitle={editingListing.title}
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t pt-6 dark:border-white/10">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setEditingListing(null);
                  setError("");
                }}
                className="rounded-control border px-6 py-2.5 dark:border-[#315064] dark:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={saveEdit}
                className="ks-btn ks-btn-primary font-medium disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10"
      aria-busy={isSaving}
    >
      {isSaving && <SavingOverlay label="Saving changes…" />}
      <div className="mx-auto max-w-6xl">
        <h1 className="ks-page-title">My listings</h1>

        <p className="mt-2 text-sm text-ink-muted">
          Manage your property listings.
        </p>

        {error && <p className="mt-5 text-danger dark:text-red-400">{error}</p>}

        {listings.length === 0 ? (
          <p className="mt-8 rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center text-ink-muted">
            No listings yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const mainImage = getMainImage(listing);

              return (
                <div
                  key={listing.id}
                  className="overflow-hidden rounded-card border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-raised"
                >
                  <img
                    src={mainImage?.url || houseImage}
                    onError={(event) => {
                      event.currentTarget.src = houseImage;
                    }}
                    alt={mainImage?.description || listing.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-ink">
                      {listing.title}
                    </h2>

                    <p className="mt-1 text-sm text-ink-muted">
                      {listing.address}, {listing.city}
                    </p>

                    <p className="mt-2 font-semibold dark:text-[#55d4aa]">
                      {listing.price} €
                      {listing.listingType === "rent" ? " / month" : ""}
                    </p>

                    <p className="mt-1 text-sm capitalize text-ink-muted">
                      Status:{" "}
                      <span className="dark:text-[#d7e1e7]">
                        {listing.status}
                      </span>
                    </p>

                    <p className="mt-1 text-sm capitalize text-ink-muted">
                      Moderation:{" "}
                      <span className="dark:text-[#d7e1e7]">
                        {listing.moderation?.status}
                      </span>
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(listing)}
                        className="rounded-control border border-pine-700 px-4 py-2 text-pine-700 transition hover:bg-pine-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteListing(listing.id)}
                        className="rounded-control border border-red-300 px-4 py-2 text-danger transition hover:bg-red-50 dark:border-red-500/70 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
