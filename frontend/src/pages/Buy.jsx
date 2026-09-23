import Properties from "../components/properties";
import PropertySearch from "../components/PropertySearch";
import { Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const Buy = ({ properties, favorites, onToggleFavorite }) => {
    const propertiesForSale = properties.filter((property) => property.listingType === "sale");
  const [visibleProperties, setVisibleProperties] = useState(propertiesForSale);
  const [activeTab, setActiveTab] = useState("recommendations");

  useEffect(() => {
    setVisibleProperties(propertiesForSale);
  }, [properties]);
  const displayedProperties = activeTab === "favorites"
    ? visibleProperties.filter((property) => favorites.includes(property.id))
    : visibleProperties;

    return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <div className="mb-7">
          <h1 className="text-3xl font-bold text-[#08243f]">
            Find a home to buy
          </h1>

          <p className="mt-2 text-gray-500">
            Search properties for sale across Finland.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <p className="mb-3 text-sm font-medium text-[#08243f]">Search for a house to buy</p>
          <PropertySearch
            properties={propertiesForSale}
            onResults={setVisibleProperties}
            placeholder="Search city, neighborhood or postal code"
          />
        </div>

        <div className="mb-6">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#08243f]">
                Discover properties
              </h2>
            </div>

            <p className="text-sm text-gray-400">
              {visibleProperties.length} properties
            </p>

          </div>

          <div className="mt-5 flex items-center gap-3">

            <button
              type="button"
              onClick={() => setActiveTab("recommendations")}
              className={
                activeTab === "recommendations"
                  ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white"
                  : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f]"
              }
            >
              <Star size={16} fill={activeTab === "recommendations" ? "currentColor" : "none"} />
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
              <Heart size={16} fill={activeTab === "favorites" ? "currentColor" : "none"} />
              Favourites
            </button>

          </div>
        </div>

        <div>
          {activeTab === "favorites" && displayedProperties.length === 0 ? (
            <p>No favourite properties yet.</p>
          ) : displayedProperties.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
              No properties found. Try a different search or change the filters.
            </p>
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

export default Buy;

