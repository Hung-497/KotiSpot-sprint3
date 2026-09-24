import Properties from "../components/Properties";
import PropertySearch from "../components/PropertySearch";
import { Star, Heart } from "lucide-react";
import { useState } from "react";

const Rent = ({ properties, favorites, onToggleFavorite }) => {
  const forRentProperties = properties.filter(
    (property) => property.listingType === "rent",
  );
  const [filteredProperties, setFilteredProperties] = useState(null);

  const visibleProperties = filteredProperties ?? forRentProperties;

  const [activeTab, setActiveTab] = useState("recommendations");
  const displayedProperties =
    activeTab === "favorites"
      ? visibleProperties.filter((property) => favorites.includes(property.id))
      : visibleProperties;

  return (
    <div className="Heading min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#08243f]">
          Find a home to rent
        </h1>

        <p className="mt-2 text-gray-500">
          Search rental properties across Finland.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-[#08243f]">
            Search for a house to rent
          </p>

          <PropertySearch
            properties={forRentProperties}
            onResults={setFilteredProperties}
            placeholder="Search city, neighborhood or postal code"
          />
        </div>

        <div className="Discover mt-10">
          <h2 className="text-2xl font-bold text-[#08243f]">
            Discover properties
          </h2>

          <div className="mt-4 flex gap-5">
            <button
              type="button"
              onClick={() => setActiveTab("recommendations")}
              className={
                activeTab === "recommendations"
                  ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white"
                  : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f]"
              }
            >
              <Star
                size={16}
                fill={activeTab === "recommendations" ? "currentColor" : "none"}
              />
              Recommended
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={
                activeTab === "favorites"
                  ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white"
                  : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f]"
              }
            >
              <Heart
                size={16}
                fill={activeTab === "favorites" ? "currentColor" : "none"}
              />
              Favourites
            </button>
          </div>
        </div>

        <div className="Properties mt-6">
          {activeTab === "favorites" && displayedProperties.length === 0 ? (
            <p>No favourite properties yet.</p>
          ) : (
            <Properties
              properties={displayedProperties}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Rent;
