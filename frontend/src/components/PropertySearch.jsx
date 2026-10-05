import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const PropertySearch = ({
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
      className={` relative z-50 ${compact ? "" : "rounded-card border border-line bg-surface p-5 shadow-card"}  `}
    >
      <div
        className={` relative flex flex-wrap items-center gap-2 ${compact ? "gap-2 rounded-full bg-surface p-2 shadow-raised dark:border dark:border-[#2f8f78]"
                                            : "rounded-control"}  `}
      >
        <div className="relative min-w-0 basis-full sm:min-w-40 sm:flex-1 sm:basis-auto">
        <Search
          size={compact ? 18 : 20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          placeholder={placeholder}
          aria-label={placeholder || "Search properties"}
          className="ks-input pl-11 text-sm"
        />
        </div>
        <button
          type="button"
          onClick={applyFilters}
          className="ks-btn ks-btn-primary flex-1 sm:flex-none"
        >
          Search
        </button>
        <button
          type="button"
          aria-expanded={isFilterOpen}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ks-btn ks-btn-secondary flex-1 sm:flex-none"
        >
          <SlidersHorizontal size={compact ? 17 : 19} />
          Filter
        </button>
      </div>

      {isFilterOpen && (
        <div className={`  ${compact ? "absolute left-0 right-0 z-100" : "relative"} mt-2 grid grid-cols-1 gap-3 rounded-card border border-line bg-surface p-4 shadow-raised sm:grid-cols-2 lg:grid-cols-3 `}>
          {!compact && (
            <p className="col-span-full text-sm font-medium text-ink">
              Filter properties
            </p>
          )}
          <input
            type="text"
            placeholder="Location or postal code"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="ks-input border text-sm"
          />
          <select
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
            className="ks-input border text-sm"
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
            className="ks-input border text-sm"
          >
            <option value="">Buy or rent</option>
            <option value="sale">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <select
            value={rooms}
            onChange={(event) => setRooms(event.target.value)}
            className="ks-input border text-sm"
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
            className="ks-input border text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="ks-input border text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Minimum size m²"
            value={minSize}
            onChange={(event) => setMinSize(event.target.value)}
            className="ks-input border text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum size m²"
            value={maxSize}
            onChange={(event) => setMaxSize(event.target.value)}
            className="ks-input border text-sm"
          />
          <button
            type="button"
            onClick={() => {
              applyFilters();
              setIsFilterOpen(false);
            }}
            className="ks-btn ks-btn-primary text-sm font-medium"
          >
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertySearch;
