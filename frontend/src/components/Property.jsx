import { Link } from "react-router-dom";
import { useRef } from "react";
import { Heart, MapPin, Ruler, DoorOpen } from "lucide-react";
import CardPhotos from "./CardPhotos";
import useCardPhotoCycle from "../hooks/useCardPhotoCycle";
import { getCardPhotos } from "../utils/cardPhotos";
import { formatPrice } from "../utils/formatPrice";
import { MAX_COMPARISON_PROPERTIES } from "./ComparisonActions";

const Property = ({
  property,
  favorites,
  onToggleFavorite,
  selectedProperties = [],
  setSelectedProperties,
}) => {
  const isFavorite = favorites.includes(property.id);
  const isSelected = selectedProperties.includes(property.id);
  const { address, city, price, size, rooms, listingType } = property;
  const isRental = listingType === "rent";
  const photoCycle = useCardPhotoCycle(getCardPhotos(property).length);
  const photoRef = useRef(null);
  const detailPath = `/properties/${property.id}`;

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
    <article
      onPointerEnter={photoCycle.start}
      onPointerLeave={photoCycle.stop}
      className={`group flex h-full flex-col overflow-hidden rounded-card border bg-surface shadow-card transition-[border-color,box-shadow] hover:shadow-raised ${
        isSelected ? "border-pine-600 ring-1 ring-pine-600 dark:border-[#55d4aa]/60 dark:ring-[#55d4aa]/50" : "border-line"
      }`}
    >
      <div className="relative">
        <Link
          to={detailPath}
          className="block rounded-t-card focus-visible:-outline-offset-2"
        >
          <CardPhotos
            property={property}
            index={photoCycle.index}
            hasHovered={photoCycle.hasHovered}
            photoRef={photoRef}
          />

          <div className="px-4 pb-3 pt-3.5">
            <p className="ks-price">
              {formatPrice(price)}
              {isRental && <span className="ks-price-unit"> / month</span>}
            </p>
            <p className="mt-1 truncate font-medium text-ink">{address}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted">
              <MapPin size={14} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{city}</span>
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              {size != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Ruler size={14} strokeWidth={1.8} aria-hidden="true" />
                  {size} m²
                </span>
              )}
              {rooms != null && (
                <span className="inline-flex items-center gap-1.5">
                  <DoorOpen size={14} strokeWidth={1.8} aria-hidden="true" />
                  {rooms} {rooms === 1 ? "room" : "rooms"}
                </span>
              )}
            </div>
          </div>
        </Link>

        <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-surface/95 px-2 py-0.5 text-xs font-semibold text-ink">
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
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-card transition-colors ${isFavorite
              ? "bg-pine-700 text-white hover:bg-pine-800"
              : "bg-surface/95 text-ink hover:text-pine-700"
            }`}
          onClick={() => {
            onToggleFavorite(property.id);
          }}
        >
          <Heart
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      {setSelectedProperties && (
        <label className="ks-compare-row mt-auto flex min-h-11 w-full cursor-pointer items-center gap-2 border-t border-line px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted">
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
    </article>
  );
};

export default Property;
