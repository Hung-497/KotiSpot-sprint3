import { useState } from "react";

import Listing from "../components/Listing";
import ListingDetails from "../components/ListingDetails";


const MyListings = ({
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


    return (
        <div>

            {!edit ? (

                <div className="min-h-screen bg-[#f8faf9] px-6 py-10">

                    <div className="mx-auto max-w-6xl">

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold text-[#08243f]">
                                My listings
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage and update your property listings.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {propertyListings.map((listing) => (

                                <div
                                    key={listing.id}
                                    className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <Listing listing={listing} />

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

                            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">

                                <h2 className="text-lg font-semibold text-[#08243f]">
                                    No listings yet
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    You haven't created any property listings yet.
                                </p>

                            </div>

                        )}



                    </div>

                </div>

            ) : (


                <div className="min-h-screen bg-[#f8faf9] px-6 py-10">

                    <div className="mx-auto max-w-4xl">

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold text-[#08243f]">
                                Edit your listing
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Update your property information.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

                            <h2 className="mb-6 text-xl font-semibold text-[#08243f]">
                                Property information
                            </h2>


                            <div className="mb-5">

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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                />

                            </div>


                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                    />

                                </div>

                            </div>


                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                    >

                                        <option value="">
                                            Select property type
                                        </option>

                                        <option value="apartment">
                                            Apartment
                                        </option>

                                        <option value="house">
                                            House
                                        </option>

                                        <option value="room">
                                            Room
                                        </option>

                                        <option value="studio">
                                            Studio
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="mb-5 grid grid-cols-2 gap-5 md:grid-cols-4">

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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                    />

                                </div>

                            </div>


                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                    >

                                        <option value="">
                                            Select condition
                                        </option>

                                        <option value="new">
                                            New
                                        </option>

                                        <option value="excellent">
                                            Excellent
                                        </option>

                                        <option value="good">
                                            Good
                                        </option>

                                        <option value="needsRenovation">
                                            Needs renovation
                                        </option>

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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                    />

                                </div>

                            </div>


                            <div>

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
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                />

                            </div>

                            {selectedListing.listingType === "forRent" && (

                                <div className="mt-8 border-t border-gray-200 pt-7">

                                    <h2 className="mb-6 text-xl font-semibold text-[#08243f]">
                                        Rental details
                                    </h2>


                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
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
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                            >

                                                <option value="">
                                                    Select rental period
                                                </option>

                                                <option value="1 Month">
                                                    1 month
                                                </option>

                                                <option value="3 Months">
                                                    3 months
                                                </option>

                                                <option value="6 Months">
                                                    6 months
                                                </option>

                                                <option value="12 Months">
                                                    12 months
                                                </option>

                                                <option value="24 Months">
                                                    24 months
                                                </option>

                                                <option value="No minimum">
                                                    No minimum
                                                </option>

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
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {selectedListing.listingType === "forSale" && (

                                <div className="mt-8 border-t border-gray-200 pt-7">

                                    <h2 className="mb-6 text-xl font-semibold text-[#08243f]">
                                        Sale details
                                    </h2>


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
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#17634f]"
                                        />

                                    </div>

                                </div>

                            )}


                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#08243f] transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="rounded-lg bg-[#17634f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#12503f]"
                                >
                                    Save changes
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default MyListings;