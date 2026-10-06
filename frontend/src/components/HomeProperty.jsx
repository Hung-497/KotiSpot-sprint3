import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Heart } from "lucide-react";
import CardPhotos from "./CardPhotos";
import useCardPhotoCycle from "../hooks/useCardPhotoCycle";
import { getCardPhotos } from "../utils/cardPhotos";
import { MAX_COMPARISON_PROPERTIES } from "./ComparisonActions";
import { navigateWithPhotoTransition } from "../utils/photoTransition";

const HomeProperty = ({
  property,
  favorites,
  onToggleFavorite,
  selectedProperties = [],
  setSelectedProperties,
}) => {
  const isFavorite = favorites.includes(property.id);
  const isSelected = selectedProperties.includes(property.id);
  const { address, city, price, size, listingType } = property;
  const isRental = listingType === "rent";

  const photoCycle = useCardPhotoCycle(getCardPhotos(property).length);
  const navigate = useNavigate();
  const photoRef = useRef(null);
  const detailPath = `/properties/${property.id}`;

  const openDetail = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const photo = Array.from(photoRef.current?.parentElement.querySelectorAll("img") || [])
      .find((image) => image.getClientRects().length > 0);
    navigateWithPhotoTransition(navigate, detailPath, photo);
  };

  const handleCompare = () => {
    if (!isSelected && selectedProperties.length >= MAX_COMPARISON_PROPERTIES) {
      window.alert(`You can compare up to ${MAX_COMPARISON_PROPERTIES} properties. Deselect one before adding another.`);
      return;
    }

    setSelectedProperties((current) => {
      if (current.includes(property.id)) {
        return current.filter((id) => id !== property.id);
      }

      if (current.length >= MAX_COMPARISON_PROPERTIES) {
        return current;
      }

      return [...current, property.id];
    });
  };

  return (
    <div onPointerEnter={photoCycle.start} onPointerLeave={photoCycle.stop} style={{ width: "100%" }} className={`property-card flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-[#2b5262] dark:bg-[#0b2233] dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)] dark:hover:border-[#3d7c71] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] ${
      isSelected ? "ring-2 ring-pine-600 dark:ring-[#55d4aa]/70" : ""
    }`}>
      <div className="relative">
        <Link to={detailPath} onClick={openDetail} data-no-route-transition>
          <CardPhotos
            property={property}
            index={photoCycle.index}
            hasHovered={photoCycle.hasHovered}
            photoRef={photoRef}
            mediaClassName="h-28.75 w-full object-cover"
          />

          <div className="property-info bg-white text-[#08243f] dark:bg-[#0b2233] dark:text-gray-200">
            <div className="font-semibold dark:text-white">
              {address}
            </div>

            <div className="dark:text-gray-300">
              ⌖ {city}
            </div>

            <div className="dark:text-gray-100">
              {price} €{isRental ? " / month" : ""}
            </div>

            <div className="dark:text-gray-300">
              {size} m² 
            </div>

          </div>
        </Link>

        <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-surface/95 px-2 py-0.5 text-xs font-semibold text-ink">
          {isRental ? "For rent" : "For sale"}
        </span>

        <button
          type="button"
          aria-label={
            isFavorite
              ? "Remove property from favorites"
              : "Add property to favorites"
          }
          aria-pressed={isFavorite}
          className={`favorite-button absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105 ${
            isFavorite
              ? "bg-pine-700 text-white hover:bg-pine-800 dark:bg-[#18a77c] dark:hover:bg-[#14906b]"
              : "bg-white/90 text-pine-700 hover:bg-white dark:border dark:border-[#3a6673] dark:bg-[#0b2233]/90 dark:text-white dark:hover:border-[#55d4aa] dark:hover:text-[#55d4aa]"
          }`}
          onClick={() => {
            onToggleFavorite(property.id);
          }}
        >
          <Heart
            size={18}
            strokeWidth={2}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      {setSelectedProperties && (
        <label className="ks-compare-row mt-auto flex min-h-11 cursor-pointer items-center gap-2 border-t border-gray-200 px-3 py-2.5 text-sm text-[#08243f] transition-colors hover:bg-pine-50">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCompare}
            className="ks-compare-checkbox"
          />
          <span className={`ks-compare-text ${isSelected ? "font-medium text-pine-700" : ""}`}>
            Compare<span className="sr-only"> {address}, {city}</span>
          </span>
        </label>
      )}
    </div>
  );
};

export default HomeProperty;
