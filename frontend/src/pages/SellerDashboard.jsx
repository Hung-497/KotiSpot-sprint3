import { useState } from "react";
import { Link } from "react-router-dom";

import Listing from "../components/Listing";
import ListingDetails from "../components/ListingDetails";

const SellerDashboard = ({
    propertyListings,
    deleteListing,
    updateListing
}) => {

    const [selectedListing, setSelectedListing] = useState(null);

    const [edit, setEdit] = useState(false);

    const handleEdit = (listing) => {
        setSelectedListing({ ...listing });
        setEdit(true);
    };

    const handleSave = () => {
        updateListing(selectedListing);

        setEdit(false);
        setSelectedListing(null);
    };

    const handleCancel = () => {
        setEdit(false);
        setSelectedListing(null);
    };

    const forSaleCount = propertyListings.filter(
        (listing) => listing.listingType === "forSale"
    ).length;

    const forRentCount = propertyListings.filter(
        (listing) => listing.listingType === "forRent"
    ).length;

    return (
        <div className="min-h-screen bg-[#f5f7f6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">  
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                        {
                            label: "Total listings",
                            value: propertyListings.length,
                            accent: "bg-[#eaf7f1] text-[#17634f]"
                        },
                        {
                            label: "For sale",
                            value: forSaleCount,
                            accent: "bg-[#eef4ff] text-[#1f4b8f]"
                        },
                        {
                            label: "For rent",
                            value: forRentCount,
                            accent: "bg-[#fff7e8] text-[#a46800]"
                        }
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stat.accent}`}>
                                {stat.label}
                            </div>
                            <div className="text-3xl font-bold text-[#08243f]">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </section>

                {!edit ? (
                    <section className="p-0">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#08243f]">
                                    My listings
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Review and manage your active properties.
                                </p>
                            </div>

                            <Link
                                to="/listings"
                                className="inline-flex items-center justify-center rounded-xl border border-[#17634f] bg-[#eef6f2] px-4 py-2.5 text-sm font-medium text-[#17634f] transition hover:bg-[#dfeeea]"
                            >
                                Add listing
                            </Link>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {propertyListings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <Listing
                                        listing={listing}
                                        onClick={setSelectedListing}
                                    />

                                    <div className="flex gap-3 border-t border-slate-200 p-4">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(listing)}
                                            className="flex-1 rounded-xl border border-[#17634f] bg-[#eef6f2] px-4 py-2.5 text-sm font-semibold text-[#17634f] transition hover:bg-[#dfeeea]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteListing(listing.id)}
                                            className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {propertyListings.length === 0 && (
                            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                                <h3 className="text-lg font-semibold text-[#08243f]">
                                    No listings yet
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Your property portfolio is empty. Create your first listing to get started.
                                </p>
                            </div>
                        )}

                    </section>
                ) : (
                    <section className="p-0">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
                                    Update listing
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#08243f]">
                                    Edit your listing
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={selectedListing.title}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            title: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={selectedListing.location}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            location: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={selectedListing.address}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            address: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Postal code
                                </label>
                                <input
                                    type="text"
                                    value={selectedListing.postalCode}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            postalCode: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Property type
                                </label>
                                <select
                                    value={selectedListing.propertyType}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            propertyType: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                >
                                    <option value="">Select property type</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="room">Room</option>
                                    <option value="studio">Studio</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Rooms
                                </label>
                                <input
                                    type="number"
                                    value={selectedListing.rooms}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            rooms: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    value={selectedListing.bedrooms}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            bedrooms: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    value={selectedListing.bathrooms}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            bathrooms: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Size (m²)
                                </label>
                                <input
                                    type="number"
                                    value={selectedListing.size}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            size: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Condition
                                </label>
                                <select
                                    value={selectedListing.condition}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            condition: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                >
                                    <option value="">Select condition</option>
                                    <option value="new">New</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="needsRenovation">Needs renovation</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Available from
                                </label>
                                <input
                                    type="date"
                                    value={selectedListing.availableFrom}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            availableFrom: event.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                    Description
                                </label>
                                <textarea
                                    value={selectedListing.description}
                                    onChange={(event) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            description: event.target.value
                                        })
                                    }
                                    rows="5"
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f] focus:bg-white"
                                />
                            </div>
                        </div>

                        {selectedListing.listingType === "forRent" && (
                            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                                <h3 className="mb-5 text-xl font-semibold text-[#08243f]">
                                    Rental details
                                </h3>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                            Monthly rent (€)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedListing.monthlyRent}
                                            onChange={(event) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    monthlyRent: event.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                            Security deposit (€)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedListing.securityDeposit}
                                            onChange={(event) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    securityDeposit: event.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                            Minimum rental period
                                        </label>
                                        <select
                                            value={selectedListing.minimumRentalPeriod}
                                            onChange={(event) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    minimumRentalPeriod: event.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f]"
                                        >
                                            <option value="">Select rental period</option>
                                            <option value="1 Month">1 month</option>
                                            <option value="3 Months">3 months</option>
                                            <option value="6 Months">6 months</option>
                                            <option value="12 Months">12 months</option>
                                            <option value="24 Months">24 months</option>
                                            <option value="No minimum">No minimum</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                            Additional costs / Utilities (€)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedListing.additionalCosts}
                                            onChange={(event) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    additionalCosts: event.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedListing.listingType === "forSale" && (
                            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                                <h3 className="mb-5 text-xl font-semibold text-[#08243f]">
                                    Sale details
                                </h3>
                                <div className="max-w-md">
                                    <label className="mb-2 block text-sm font-medium text-[#08243f]">
                                        Price (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedListing.price}
                                        onChange={(event) =>
                                            setSelectedListing({
                                                ...selectedListing,
                                                price: event.target.value
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#17634f]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-xl bg-[#17634f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12503f]"
                            >
                                Save changes
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;

