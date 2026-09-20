import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const PropertySearch = ({ properties, onResults, placeholder, compact = false }) => {
    const [search, setSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [listingType, setListingType] = useState("");
    const [rooms, setRooms] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");

    const applyFilters = () => {
        const searchQuery = search.trim().toLowerCase();
        const locationQuery = location.trim().toLowerCase();
        const filteredProperties = properties.filter((property) => {
            const matchesSearch = !searchQuery || [
                property.title,
                property.address,
                property.city,
                property.postalCode,
                property.propertySubType,
            ].some((value) => String(value || "").toLowerCase().includes(searchQuery));

            const matchesLocation = !locationQuery ||
                property.city.toLowerCase().includes(locationQuery) ||
                property.postalCode.includes(locationQuery);

            const matchesType = !propertyType || property.propertySubType === propertyType;
            const matchesListing = !listingType || property.listingType === listingType;
            const matchesRooms = !rooms || property.rooms === Number(rooms);
            const matchesMinPrice = !minPrice || Number(property.price) >= Number(minPrice);
            const matchesMaxPrice = !maxPrice || Number(property.price) <= Number(maxPrice);
            const matchesMinSize = !minSize || property.size >= Number(minSize);
            const matchesMaxSize = !maxSize || property.size <= Number(maxSize);

            return matchesSearch && matchesLocation && matchesType && matchesListing &&
                matchesRooms && matchesMinPrice && matchesMaxPrice && matchesMinSize && matchesMaxSize;
        });

        onResults(filteredProperties);
    };

    return (
        <div className={`relative ${compact ? "" : "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"}`}>
                <div className={`relative flex ${compact ? "rounded-full bg-white p-2 shadow-md" : "overflow-hidden rounded-xl border border-gray-300"}`}>
                    <Search
                        size={compact ? 18 : 20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                <input
                    type="text"
                    autoComplete="off"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && applyFilters()}
                    placeholder={placeholder}
                    className={compact
                        ? "flex-1 px-4 py-2 pl-10 text-sm text-[#08243f] outline-none"
                        : "w-full py-4 pl-12 pr-4 text-sm text-[#08243f] outline-none"}
                />
                <button type="button" onClick={applyFilters} className={compact
                    ? "rounded-full bg-[#17634f] px-5 py-2 text-sm font-medium text-white hover:bg-[#12503f]"
                    : "border-l border-gray-300 bg-white px-5 text-sm font-medium text-[#17634f] hover:bg-[#eef6f2]"}>
                    Search
                </button>
                <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} className={compact
                    ? "flex items-center gap-2 rounded-full bg-[#eef6f2] px-4 py-2 text-sm font-medium text-[#08243f]"
                    : "flex items-center gap-2 border-l border-gray-300 px-7 font-medium text-[#08243f] hover:bg-gray-50"}>
                    <SlidersHorizontal size={compact ? 17 : 19} />
                    Filter
                </button>
            </div>

            {isFilterOpen && (
                <div className="absolute left-0 right-0 z-20 mt-2 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-3">
                    {!compact && <p className="col-span-full text-sm font-medium text-[#08243f]">Filter properties</p>}
                    <input type="text" placeholder="Location or postal code" value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]" />
                    <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]">
                        <option value="">Property type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="studio">Studio</option>
                        <option value="room">Room</option>
                    </select>
                    <select value={listingType} onChange={(event) => setListingType(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]">
                        <option value="">Buy or rent</option>
                        <option value="sale">Buy</option>
                        <option value="rent">Rent</option>
                    </select>
                    <select value={rooms} onChange={(event) => setRooms(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]">
                        <option value="">Rooms</option>
                        {[1, 2, 3, 4, 5].map((room) => <option key={room} value={room}>{room} {room === 1 ? "room" : "rooms"}</option>)}
                    </select>
                    <input type="number" min="0" placeholder="Minimum price" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]" />
                    <input type="number" min="0" placeholder="Maximum price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]" />
                    <input type="number" min="0" placeholder="Minimum size m²" value={minSize} onChange={(event) => setMinSize(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]" />
                    <input type="number" min="0" placeholder="Maximum size m²" value={maxSize} onChange={(event) => setMaxSize(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]" />
                    <button type="button" onClick={() => { applyFilters(); setIsFilterOpen(false); }} className="rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#12503f]">Apply filters</button>
                </div>
            )}
        </div>
    );
};

export default PropertySearch;
