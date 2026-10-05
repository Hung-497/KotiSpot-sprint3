import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const HomePropertySearch = ({
  properties,
  onResults,
  placeholder,
  compact = false,
}) => {
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
      const matchesSearch =
        !searchQuery ||
        [
          property.title,
          property.address,
          property.city,
          property.postalCode,
          property.propertySubType,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchQuery),
        );

      const matchesLocation =
        !locationQuery ||
        property.city.toLowerCase().includes(locationQuery) ||
        property.postalCode.includes(locationQuery);

      const matchesType =
        !propertyType || property.propertySubType === propertyType;
      const matchesListing =
        !listingType || property.listingType === listingType;
      const matchesRooms = !rooms || property.rooms === Number(rooms);
      const matchesMinPrice =
        !minPrice || Number(property.price) >= Number(minPrice);
      const matchesMaxPrice =
        !maxPrice || Number(property.price) <= Number(maxPrice);
      const matchesMinSize = !minSize || property.size >= Number(minSize);
      const matchesMaxSize = !maxSize || property.size <= Number(maxSize);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesListing &&
        matchesRooms &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinSize &&
        matchesMaxSize
      );
    });

    onResults(filteredProperties);
  };

  return (
    <div
      className={`relative z-50 max-sm:[&_input]:min-h-11 max-sm:[&_input]:min-w-0 max-sm:[&_input]:text-base max-sm:[&_select]:min-h-11 max-sm:[&_select]:min-w-0 max-sm:[&_select]:text-base ${compact ? "" : "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#294457] dark:bg-[#0b1d2b]"}`}
    >
      <div
        className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center sm:flex ${compact ? "gap-2 rounded-2xl bg-white p-2 shadow-md sm:rounded-full dark:border dark:border-[#2f8f78] dark:bg-[#0b2233]/95 dark:shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
                                            : "gap-2 rounded-xl border border-gray-300 p-2 sm:gap-0 sm:p-0 dark:border-[#294457] dark:bg-[#0b1d2b]"}`}
      >
        <Search
          size={compact ? 18 : 20}
          className="absolute left-4 top-7 -translate-y-1/2 text-gray-400 sm:top-1/2 dark:text-white/80"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          placeholder={placeholder}
          className={
            compact
              ? "col-span-2 min-w-0 flex-1 bg-transparent px-4 py-2 pl-10 text-base text-[#08243f] outline-none placeholder:text-gray-400 sm:text-sm dark:text-white dark:placeholder:text-gray-400"
              : "col-span-2 min-w-0 w-full bg-transparent py-4 pl-12 pr-4 text-base text-[#08243f] outline-none placeholder:text-gray-400 sm:text-sm dark:text-white dark:placeholder:text-gray-400"
          }
        />
        <button
          type="button"
          onClick={applyFilters}
          className={
            compact
              ? "rounded-full bg-[#03654b] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e9873] dark:bg-[#10b981] dark:hover:bg-[#0d9f70]"
              : "rounded-full bg-[#12ad83] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e9873] dark:bg-[#20c997] dark:text-[#06241d] dark:hover:bg-[#2bd8a6] dark:shadow-[0_0_20px_rgba(32,201,151,0.18)]"
          }
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={
            compact
              ? "flex items-center gap-2 rounded-full bg-[#09004f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00115f] dark:bg-white dark:text-[#08243f] dark:hover:bg-[#f0f0f0]"
              : "flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 font-medium text-[#08243f] transition hover:bg-gray-50 dark:border-[#315064] dark:bg-[#0a1e2c] dark:text-white dark:hover:bg-[#102b3b]"
          }
        >
          <SlidersHorizontal size={compact ? 17 : 19} />
          Filter
        </button>
      </div>

      {isFilterOpen && (
        <div className={`${compact ? "absolute left-0 right-0 z-100 max-h-[60dvh] overflow-y-auto" : "relative"} mt-2 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-3 dark:border-[#294457] dark:bg-[#0b1d2b] dark:shadow-[0_15px_35px_rgba(0,0,0,0.35)]`}>
          {!compact && (
            <p className="col-span-full text-sm font-medium text-black dark:text-[#f3f4f5]">
              Filter properties
            </p>
          )}
          <input
            type="text"
            placeholder="Location or postal code"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#55d4aa]"
          />
          <select
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:focus:border-[#55d4aa]"
          >
            <option value="">Property type</option>
            <option value="apartment">Apartment</option>
            <option value="detached-house">Detached house</option>
            <option value="studio">Studio</option>
            <option value="semi-detached-house">Semi-detached house</option>
            <option value="terraced-house">Terraced house</option>
          </select>
          <select
            value={listingType}
            onChange={(event) => setListingType(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:focus:border-[#55d4aa]"
          >
            <option value="">Buy or rent</option>
            <option value="sale">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <select
            value={rooms}
            onChange={(event) => setRooms(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:focus:border-[#55d4aa]"
          >
            <option value="">Rooms</option>
            {[1, 2, 3, 4, 5].map((room) => (
              <option key={room} value={room}>
                {room} {room === 1 ? "room" : "rooms"}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#55d4aa]"
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#55d4aa]"
          />
          <input
            type="number"
            min="0"
            placeholder="Minimum size m²"
            value={minSize}
            onChange={(event) => setMinSize(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#55d4aa]"
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum size m²"
            value={maxSize}
            onChange={(event) => setMaxSize(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pine-700 dark:border-[#294457] dark:bg-[#0a1e2c] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#55d4aa]"
          />
          <button
            type="button"
            onClick={() => {
              applyFilters();
              setIsFilterOpen(false);
            }}
            className="rounded-lg bg-pine-700 px-4 py-2 text-sm font-medium text-white hover:bg-pine-800"
          >
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePropertySearch;
