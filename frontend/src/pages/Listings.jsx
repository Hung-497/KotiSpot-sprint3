import { useState } from "react";

// there is no real login yet, so every listing is posted as user 1
const userId = 1;

// turns an uploaded photo file into a data URL string the backend can store
const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(new Error(`Could not read the photo "${file.name}". Please try another file.`));
        };

        reader.readAsDataURL(file);
    });
};

const Listings = ({ setPropertyListings, onListingPublished }) => {
    const [listingType, setListingType] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newListing, setNewListing] = useState({
        title: "",
        city: "",
        address: "",
        postalCode: "",
        propertySubType: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        rooms: "",
        features: [],
        description: "",
        availableFrom: "",
        deposit: "",
        minimumRentalPeriod: "",
        additionalCosts: "",
        photos: [],
        price: "",
        condition: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormError("");
        setFormMessage("");

        setNewListing((prevListing) => ({
            ...prevListing,
            [name]: value
        }));
    };

    const handleFeatureChange = (event) => {
        const { value, checked } = event.target;

        setNewListing((prevListing) => ({
            ...prevListing,
            features: checked
                ? [...prevListing.features, value]
                : prevListing.features.filter(
                    (feature) => feature !== value
                )
        }));
    };

    const handlePhotoChange = (event) => {
        const files = Array.from(event.target.files);

        setNewListing((prevListing) => ({
            ...prevListing,
            photos: [...prevListing.photos, ...files]
        }));
    };

    const addListing = async () => {
        setFormError("");
        setFormMessage("");

        if (!listingType) {
            setFormError("Please choose whether the property is for sale or for rent.");
            return;
        }

        const requiredFields = [
            ["title", "title"], ["city", "location"], ["address", "address"],
            ["postalCode", "postal code"], ["propertySubType", "property type"],
            ["bedrooms", "bedrooms"], ["bathrooms", "bathrooms"], ["size", "size"],
            ["rooms", "rooms"], ["description", "description"], ["availableFrom", "available date"],
            ["condition", "condition"],
        ];

        const missingField = requiredFields.find(([field]) => !String(newListing[field]).trim());
        if (missingField) {
            setFormError(`Please fill in the ${missingField[1]} field.`);
            return;
        }

        const listingSpecificFields = listingType === "forRent"
            ? [["price", "monthly rent"], ["deposit", "security deposit"], ["minimumRentalPeriod", "minimum rental period"], ["additionalCosts", "additional costs"]]
            : [["price", "price"]];
        const missingListingField = listingSpecificFields.find(([field]) => !String(newListing[field]).trim());
        if (missingListingField) {
            setFormError(`Please fill in the ${missingListingField[1]} field.`);
            return;
        }

        const localId = Date.now();
        const listingToAdd = {
            ...newListing,
            listingType: listingType,
            id: localId
        };

        setPropertyListings((prevListings) => [
            ...prevListings,
            listingToAdd
        ]);

        const propertyToPost = {
            ownerId: userId,
            title: newListing.title,
            description: newListing.description,
            listingType: listingType === "forRent" ? "rent" : "sale",
            propertyType: "residential",
            propertySubType: newListing.propertySubType,
            currency: "EUR",
            city: newListing.city,
            address: newListing.address,
            postalCode: newListing.postalCode,
            rooms: Number(newListing.rooms),
            bedrooms: Number(newListing.bedrooms),
            bathrooms: Number(newListing.bathrooms),
            size: Number(newListing.size),
            price: Number(newListing.price),
            features: {
                balcony: newListing.features.includes("balcony"),
                elevator: newListing.features.includes("elevator"),
                parking: newListing.features.includes("parking"),
                furnished: newListing.features.includes("furnished"),
                petsAllowed: newListing.features.includes("petsAllowed"),
                sauna: newListing.features.includes("sauna"),
            },
            status: "active",
        };

        if (listingType === "forRent") {
            propertyToPost.rentalDetails = {
                availableFrom: newListing.availableFrom,
                deposit: Number(newListing.deposit),
                minimumRentalPeriod: parseInt(newListing.minimumRentalPeriod, 10) || 1,
                additionalCosts: newListing.additionalCosts,
            };
        }

        const photos = newListing.photos;
        const photoDescription = newListing.title || "Property photo";

        // the listing is already saved locally, so the form can be cleared right away
        setNewListing({
            title: "",
            city: "",
            address: "",
            postalCode: "",
            propertySubType: "",
            bedrooms: "",
            bathrooms: "",
            size: "",
            rooms: "",
            features: [],
            description: "",
            availableFrom: "",
            deposit: "",
            minimumRentalPeriod: "",
            additionalCosts: "",
            photos: [],
            price: "",
            condition: ""
        });
        setListingType("");
        setIsSubmitting(true);

        try {
            // read every uploaded photo file into a data URL before sending the listing
            const photoPromises = [];
            for (let i = 0; i < photos.length; i++) {
                photoPromises.push(readFileAsDataUrl(photos[i]));
            }
            const photoUrls = await Promise.all(photoPromises);

            const images = [];
            for (let i = 0; i < photoUrls.length; i++) {
                images.push({
                    id: i + 1,
                    url: photoUrls[i],
                    description: photoDescription,
                    isMain: i === 0
                });
            }
            propertyToPost.images = images;

            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(propertyToPost),
            });

            // 413 means the photos made the request bigger than the server accepts
            if (res.status === 413) {
                throw new Error("The photos are too large. It was saved locally only - try fewer or smaller photos.");
            }

            if (!res.ok) {
                throw new Error("Failed to publish listing to the server. It was saved locally only.");
            }

            const createdProperty = await res.json();

            // swap in the real database id so this listing can later be edited/deleted there
            setPropertyListings((prevListings) => {
                const updatedListings = [];
                for (let i = 0; i < prevListings.length; i++) {
                    const listing = prevListings[i];
                    if (listing.id === localId) {
                        updatedListings.push({ ...listing, id: createdProperty.id });
                    } else {
                        updatedListings.push(listing);
                    }
                }
                return updatedListings;
            });

            setFormMessage("Listing published successfully.");
            if (onListingPublished) {
                onListingPublished();
            }
        } catch (error) {
            console.error("Error publishing listing:", error);
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
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {formError}
                    </p>
                )}

                {formMessage && (
                    <p role="status" className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                        {formMessage}
                    </p>
                )}


                {/* LISTING PURPOSE */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                    <h2 className="font-semibold text-[#08243f]">
                        Listing purpose
                    </h2>

                    <div className="mt-4 flex gap-10">

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                value="forSale"
                                checked={listingType === "forSale"}
                                onChange={handleListingType}
                            />
                            For sale
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                value="forRent"
                                checked={listingType === "forRent"}
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
                            <label className="mb-2 block text-sm">
                                Title *
                            </label>

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
                            <label className="mb-2 block text-sm">
                                Location *
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={newListing.city}
                                onChange={handleInputChange}
                                placeholder="e.g. Helsinki, Finland"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                            />
                        </div>

                    </div>


                    {/* Address + postal */}
                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm">
                                Address *
                            </label>

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
                            <label className="mb-2 block text-sm">
                                Postal code *
                            </label>

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
                            <label className="mb-2 block text-sm">
                                Property type *
                            </label>

                            <select
                                name="propertySubType"
                                value={newListing.propertySubType}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                            >
                                <option value="">Select type</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="room">Room</option>
                                <option value="studio">Studio</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Bedrooms *
                            </label>

                            <input
                                type="number"
                                name="bedrooms"
                                value={newListing.bedrooms}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Bathrooms *
                            </label>

                            <input
                                type="number"
                                name="bathrooms"
                                value={newListing.bathrooms}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Size (m²) *
                            </label>

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


                    {/* Rooms + condition */}
                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm">
                                Rooms *
                            </label>

                            <input
                                type="number"
                                name="rooms"
                                value={newListing.rooms}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Condition *
                            </label>

                            <select
                                name="condition"
                                value={newListing.condition}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                            >
                                <option value="">Select condition</option>
                                <option value="new">New</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="needsRenovation">
                                    Needs renovation
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* Features */}
                    <div className="mt-5">

                        <label className="mb-3 block text-sm">
                            Features *
                        </label>

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

                        <label className="mb-2 block text-sm">
                            Description *
                        </label>

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
                {listingType === "forRent" && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">

                        <h2 className="mb-5 font-semibold text-[#08243f]">
                            Rental details 
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm">
                                    Monthly rent (€) *
                                </label>

                                <input
                                    type="text"
                                    value={newListing.price}
                                    name="price"
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1200"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm">
                                    Available from *
                                </label>

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
                                    Security deposit (€) *
                                </label>

                                <input
                                    type="text"
                                    value={newListing.deposit}
                                    name="deposit"
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
                                    <option value="">
                                        Select rental period *
                                    </option>
                                    <option value="1 Month">1 month</option>
                                    <option value="3 Months">3 months</option>
                                    <option value="6 Months">6 months</option>
                                    <option value="12 Months">12 months</option>
                                    <option value="24 Months">24 months</option>
                                    <option value="No minimum">No minimum</option>
                                </select>
                            </div>


                            <div>
                                <label className="mb-2 block text-sm">
                                    Additional costs / Utilities (€) *
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
                {listingType === "forSale" && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">

                        <h2 className="mb-5 font-semibold text-[#08243f]">
                            Sale details 
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm">
                                    Price (€) *
                                </label>

                                <input
                                    type="text"
                                    name="price"
                                    value={newListing.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 350000"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm">
                                    Available from *
                                </label>

                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={newListing.availableFrom}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                />
                            </div>

                        </div>

                    </div>
                )}


                {/* PHOTOS */}
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">

                    <h2 className="font-semibold text-[#08243f]">
                        Property photos
                    </h2>

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
                        + Upload photos

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </label>

                    {/* Image placeholders */}
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">

                        <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            Image placeholder
                        </div>

                        <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            Image placeholder
                        </div>

                        <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            Image placeholder
                        </div>

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
                            disabled:cursor-not-allowed
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