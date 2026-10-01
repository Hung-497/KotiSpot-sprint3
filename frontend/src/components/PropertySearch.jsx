import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { apiRequest } from "../services/api";

const featureOptions = [
  { value: "balcony", label: "Balcony" },
  { value: "elevator", label: "Elevator" },
  { value: "parking", label: "Parking" },
  { value: "furnished", label: "Furnished" },
  { value: "petsAllowed", label: "Pets allowed" },
  { value: "sauna", label: "Sauna" },
];

const inputClassName =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]";

// listingType is given on the Buy ("sale") and Rent ("rent") pages
const PropertySearch = ({
  onResults,
  placeholder,
  listingType,
  compact = false,
}) => {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [propertySubType, setPropertySubType] = useState("");
  const [buyOrRent, setBuyOrRent] = useState("");
  const [rooms, setRooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [sort, setSort] = useState("");
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFeatureChange = (event) => {
    const { value, checked } = event.target;

    setFeatures(
      checked
        ? [...features, value]
        : features.filter((feature) => feature !== value),
    );
  };

  const applyFilters = async () => {
    // Build the query string, e.g. "keyword=helsinki&maxPrice=1500"
    const params = new URLSearchParams();

    if (search.trim()) params.append("keyword", search.trim());
    if (city.trim()) params.append("city", city.trim());
    if (postalCode.trim()) params.append("postalCode", postalCode.trim());
    if (listingType || buyOrRent) {
      params.append("listingType", listingType || buyOrRent);
    }
    if (propertySubType) params.append("propertySubType", propertySubType);
    if (rooms === "7+") {
      params.append("minRooms", "7");
    } else if (rooms) {
      params.append("minRooms", rooms);
      params.append("maxRooms", rooms);
    }
    if (bedrooms) params.append("minBedrooms", bedrooms);
    if (bathrooms) params.append("minBathrooms", bathrooms);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (minSize) params.append("minSize", minSize);
    if (maxSize) params.append("maxSize", maxSize);
    if (minYear) params.append("minYear", minYear);
    if (maxYear) params.append("maxYear", maxYear);
    if (sort) params.append("sort", sort);
    features.forEach((feature) => params.append(feature, "true"));

    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/properties/filter?${params}`);
      onResults(data);
    } catch (error) {
      setError(error.message);
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setPostalCode("");
    setPropertySubType("");
    setBuyOrRent("");
    setRooms("");
    setBedrooms("");
    setBathrooms("");
    setMinPrice("");
    setMaxPrice("");
    setMinSize("");
    setMaxSize("");
    setMinYear("");
    setMaxYear("");
    setSort("");
    setFeatures([]);
    setError("");
    onResults(null);
  };

  return (
    <div
      className={`relative z-30 ${compact ? "" : "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"}`}
    >
      <div
        className={`relative flex ${compact ? "rounded-full bg-white p-2 shadow-md" : "overflow-hidden rounded-xl border border-gray-300"}`}
      >
        <Search
          size={compact ? 18 : 20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          placeholder={placeholder}
          className={
            compact
              ? "flex-1 px-4 py-2 pl-10 text-sm text-[#08243f] outline-none"
              : "w-full py-4 pl-12 pr-4 text-sm text-[#08243f] outline-none"
          }
        />
        <button
          type="button"
          onClick={applyFilters}
          disabled={isLoading}
          className={
            compact
              ? "rounded-full bg-[#17634f] px-5 py-2 text-sm font-medium text-white hover:bg-[#12503f] disabled:opacity-60"
              : "border-l border-gray-300 bg-white px-5 text-sm font-medium text-[#17634f] hover:bg-[#eef6f2] disabled:opacity-60"
          }
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={
            compact
              ? "flex items-center gap-2 rounded-full bg-[#eef6f2] px-4 py-2 text-sm font-medium text-[#08243f]"
              : "flex items-center gap-2 border-l border-gray-300 px-7 font-medium text-[#08243f] hover:bg-gray-50"
          }
        >
          <SlidersHorizontal size={compact ? 17 : 19} />
          Filter
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {isFilterOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-3">
          {!compact && (
            <p className="col-span-full text-sm font-medium text-[#08243f]">
              Filter properties
            </p>
          )}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClassName}
          />
          <input
            type="text"
            placeholder="Postal code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className={inputClassName}
          />
          <select
            value={propertySubType}
            onChange={(event) => setPropertySubType(event.target.value)}
            className={inputClassName}
          >
            <option value="">Property type</option>
            <option value="apartment">Apartment</option>
            <option value="detached-house">Detached house</option>
            <option value="semi-detached-house">Semi-detached house</option>
            <option value="terraced-house">Terraced house</option>
          </select>
          {!listingType && (
            <select
              value={buyOrRent}
              onChange={(event) => setBuyOrRent(event.target.value)}
              className={inputClassName}
            >
              <option value="">Buy or rent</option>
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
          )}
          <select
            value={rooms}
            onChange={(event) => setRooms(event.target.value)}
            className={inputClassName}
          >
            <option value="">Rooms</option>
            {[1, 2, 3, 4, 5, 6].map((room) => (
              <option key={room} value={room}>
                {room} {room === 1 ? "room" : "rooms"}
              </option>
            ))}
            <option value="7+">7+ rooms</option>
          </select>
          <select
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            className={inputClassName}
          >
            <option value="">Bedrooms</option>
            {[1, 2, 3, 4].map((number) => (
              <option key={number} value={number}>
                {number}+ bedrooms
              </option>
            ))}
          </select>
          <select
            value={bathrooms}
            onChange={(event) => setBathrooms(event.target.value)}
            className={inputClassName}
          >
            <option value="">Bathrooms</option>
            {[1, 2, 3].map((number) => (
              <option key={number} value={number}>
                {number}+ bathrooms
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className={inputClassName}
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className={inputClassName}
          />
          <input
            type="number"
            min="0"
            placeholder="Minimum size m²"
            value={minSize}
            onChange={(event) => setMinSize(event.target.value)}
            className={inputClassName}
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum size m²"
            value={maxSize}
            onChange={(event) => setMaxSize(event.target.value)}
            className={inputClassName}
          />
          <input
            type="number"
            min="0"
            placeholder="Minimum year"
            value={minYear}
            onChange={(event) => setMinYear(event.target.value)}
            className={inputClassName}
          />
          <input
            type="number"
            min="0"
            placeholder="Maximum year"
            value={maxYear}
            onChange={(event) => setMaxYear(event.target.value)}
            className={inputClassName}
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className={inputClassName}
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest first</option>
          </select>
          <div className="col-span-full grid grid-cols-2 gap-2 text-sm text-[#08243f] sm:grid-cols-3">
            {featureOptions.map((feature) => (
              <label key={feature.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={feature.value}
                  checked={features.includes(feature.value)}
                  onChange={handleFeatureChange}
                />
                {feature.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[#08243f] hover:bg-gray-50"
          >
            Clear filters
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              applyFilters();
              setIsFilterOpen(false);
            }}
            className="rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#12503f] disabled:opacity-60"
          >
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertySearch;
