import PropertyTabs from "../components/PropertyTabs";
import Contours from "../components/Contours";
import Properties from "../components/Properties";
import PropertySearch from "../components/PropertySearch";
import { useState } from "react";

const Buy = ({ properties, favorites, onToggleFavorite, isLoading = false }) => {
  const propertiesForSale = properties.filter(
    (property) => property.listingType === "sale",
  );
  const [filteredProperties, setFilteredProperties] = useState(null);

  const visibleProperties = filteredProperties ?? propertiesForSale;

  const [activeTab, setActiveTab] = useState("recommendations");
  const displayedProperties =
    activeTab === "favorites"
      ? visibleProperties.filter((property) => favorites.includes(property.id))
      : visibleProperties;

  return (
    <main>
      {/* Pale pine band separates searching from the results below */}
      <section className="relative border-b border-line bg-pine-50">
        {/* Clipped separately so the filter dropdown can still open below */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Contours variant="left" className="text-pine-700 opacity-20" />
        </div>

        <div className="ks-container relative py-8 md:py-12">
      <header className="mb-6 max-w-2xl">
        <h1 className="ks-page-title">Find a home to buy</h1>
        <p className="mt-2 text-ink-muted">Search properties for sale across Finland.</p>
      </header>

      <section className="ks-card p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-ink">Search for a house to buy</p>
        <PropertySearch
          onResults={setFilteredProperties}
          properties={propertiesForSale}
          listingType="sale"
          placeholder="Search city, neighborhood or postal code"
        />
      </section>
        </div>
      </section>

      <div className="ks-container py-8 md:py-12">

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="ks-section-title text-2xl">Discover properties</h2>
          <p className="text-sm text-ink-muted">
            {isLoading ? "Loading properties…" : `${visibleProperties.length} properties`}
          </p>
        </div>

        <div className="mb-5">
          <PropertyTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {!isLoading && activeTab === "favorites" && displayedProperties.length === 0 ? (
          <p className="ks-notice">No favourite properties yet.</p>
        ) : (
          <Properties
            properties={displayedProperties}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            isLoading={isLoading}
          />
        )}
      </section>
      </div>
    </main>
  );
};

export default Buy;
