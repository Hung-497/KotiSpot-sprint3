import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import houseImage from "../assets/house1.jpg";

const emptyFeatures = {
  balcony: false,
  elevator: false,
  parking: false,
  furnished: false,
  petsAllowed: false,
  sauna: false,
};

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

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
    setEditingListing({
      ...listing,
      features: {
        ...emptyFeatures,
        ...listing.features,
      },
      rentalDetails: listing.rentalDetails
        ? { ...listing.rentalDetails }
        : null,
    });

    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditingListing((current) => ({
      ...current,
      [name]: value,
    }));
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

  const saveEdit = async () => {
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
      (
        !editingListing.rentalDetails?.availableFrom ||
        Number(
          editingListing.rentalDetails?.minimumRentalPeriod,
        ) < 1
      )
    ) {
      setError(
        "Rental listings require an available date and minimum rental period.",
      );
      return;
    }

    const updates = {
      title: editingListing.title.trim(),
      description: editingListing.description.trim(),
      propertySubType: editingListing.propertySubType,
      price: Number(editingListing.price),
      city: editingListing.city.trim(),
      address: editingListing.address.trim(),
      postalCode: editingListing.postalCode.trim(),
      rooms: Number(editingListing.rooms),
      bedrooms: Number(editingListing.bedrooms),
      bathrooms: Number(editingListing.bathrooms),
      size: Number(editingListing.size),
      features: editingListing.features,
    };

    if (editingListing.listingType === "rent") {
      updates.rentalDetails = {
        availableFrom:
          editingListing.rentalDetails.availableFrom,
        minimumRentalPeriod: Number(
          editingListing.rentalDetails
            .minimumRentalPeriod,
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

      if (
        editingListing.rentalDetails.additionalCosts?.trim()
      ) {
        updates.rentalDetails.additionalCosts =
          editingListing.rentalDetails.additionalCosts.trim();
      }
    }

    setIsSaving(true);

    try {
      const updatedListing = await apiRequest(
        `/properties/${editingListing.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        },
      );

      setListings((current) =>
        current.map((listing) =>
          listing.id === updatedListing.id
            ? updatedListing
            : listing,
        ),
      );

      setEditingListing(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteListing = async (propertyId) => {
    if (!window.confirm("Delete this listing?")) {
      return;
    }

    try {
      await apiRequest(`/properties/${propertyId}`, {
        method: "DELETE",
      });

      setListings((current) =>
        current.filter(
          (listing) => listing.id !== propertyId,
        ),
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  if (loading) {
    return (
      <p className="p-10 text-center text-gray-500">
        Loading listings...
      </p>
    );
  }

  if (editingListing) {
    return (
      <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-[#08243f]">
            Edit listing
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your property information.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            {error && (
              <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  name="title"
                  value={editingListing.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Property type
                </label>

                <select
                  name="propertySubType"
                  value={editingListing.propertySubType}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="apartment">
                    Apartment
                  </option>

                  <option value="detached-house">
                    Detached house
                  </option>

                  <option value="studio">
                    Studio
                  </option>

                  <option value="semi-detached-house">
                    Semi-detached house
                  </option>

                  <option value="terraced-house">
                    Terraced house
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price (€)
                </label>

                <input
                  name="price"
                  type="number"
                  min="1"
                  value={editingListing.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  City
                </label>

                <input
                  name="city"
                  value={editingListing.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Address
                </label>

                <input
                  name="address"
                  value={editingListing.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Postal code
                </label>

                <input
                  name="postalCode"
                  value={editingListing.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Size (m²)
                </label>

                <input
                  name="size"
                  type="number"
                  min="1"
                  value={editingListing.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Rooms
                </label>

                <input
                  name="rooms"
                  type="number"
                  min="1"
                  step="1"
                  value={editingListing.rooms}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Bedrooms
                </label>

                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  step="1"
                  value={editingListing.bedrooms}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Bathrooms
                </label>

                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="1"
                  value={editingListing.bathrooms}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={editingListing.description}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border px-4 py-3"
                />
              </div>

            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="mb-4 text-lg font-semibold text-[#08243f]">
                Features
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {[
                  ["balcony", "Balcony"],
                  ["elevator", "Elevator"],
                  ["parking", "Parking"],
                  ["furnished", "Furnished"],
                  ["petsAllowed", "Pets allowed"],
                  ["sauna", "Sauna"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={
                        editingListing.features?.[name] ??
                        false
                      }
                      onChange={handleFeatureChange}
                    />

                    {label}
                  </label>
                ))}
              </div>
            </div>

            {editingListing.listingType === "rent" && (
              <div className="mt-8 border-t pt-6">
                <h2 className="mb-5 text-lg font-semibold text-[#08243f]">
                  Rental details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Available from
                    </label>

                    <input
                      name="availableFrom"
                      type="date"
                      value={
                        editingListing.rentalDetails
                          ?.availableFrom || ""
                      }
                      onChange={handleRentalChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Minimum rental period
                    </label>

                    <input
                      name="minimumRentalPeriod"
                      type="number"
                      min="1"
                      step="1"
                      value={
                        editingListing.rentalDetails
                          ?.minimumRentalPeriod ?? ""
                      }
                      onChange={handleRentalChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Deposit (€)
                    </label>

                    <input
                      name="deposit"
                      type="number"
                      min="0"
                      value={
                        editingListing.rentalDetails
                          ?.deposit ?? ""
                      }
                      onChange={handleRentalChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Additional costs
                    </label>

                    <input
                      name="additionalCosts"
                      value={
                        editingListing.rentalDetails
                          ?.additionalCosts || ""
                      }
                      onChange={handleRentalChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setEditingListing(null);
                  setError("");
                }}
                className="rounded-lg border px-6 py-2.5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={saveEdit}
                className="rounded-lg bg-[#17634f] px-6 py-2.5 font-medium text-white disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#08243f]">
          My listings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your property listings.
        </p>

        {error && (
          <p className="mt-5 text-red-600">
            {error}
          </p>
        )}

        {listings.length === 0 ? (
          <p className="mt-8">
            No listings yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const image =
                listing.images?.find(
                  (image) => image.isMain,
                )?.url ||
                listing.images?.[0]?.url ||
                houseImage;

              return (
                <div
                  key={listing.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <img
                    src={image}
                    alt={listing.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-[#08243f]">
                      {listing.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {listing.address}, {listing.city}
                    </p>

                    <p className="mt-2 font-semibold">
                      {listing.price} €
                      {listing.listingType === "rent"
                        ? " / month"
                        : ""}
                    </p>

                    <p className="mt-1 text-sm capitalize text-gray-500">
                      Moderation:{" "}
                      {listing.moderation?.status}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(listing)
                        }
                        className="rounded-lg border border-[#17634f] px-4 py-2 text-[#17634f]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteListing(listing.id)
                        }
                        className="rounded-lg border border-red-300 px-4 py-2 text-red-600"
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