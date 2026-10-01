import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import houseImage from "../assets/house1.jpg";
import houseImageDark from "../assets/house1_dark.png";
import { getMainImage } from "../utils/imageUtils";

const Property = ({ property, favorites, onToggleFavorite }) => {
  const isFavorite = favorites.includes(property.id);
  const { address, city, price, size, listingType } = property;
  const isRental = listingType === "rent";

  const mainImage = getMainImage(property);

  return (
    <div className="property-card w-60 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-[#2b5262] dark:bg-[#0b2233] dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)] dark:hover:border-[#3d7c71] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img
            src={mainImage?.url || houseImage}
            onError={(event) => {
              event.currentTarget.src = houseImage;
            }}
            alt={mainImage?.description || property.title || "Property photo"}
            className="h-28.75 w-full object-cover dark:hidden"
          />

          <img
            src={houseImageDark}
            alt={mainImage?.description || property.title || "Property photo"}
            className="hidden h-28.75 w-full object-cover dark:block"
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
              ? "bg-[#17634f] text-white hover:bg-[#12503f] dark:bg-[#18a77c] dark:hover:bg-[#14906b]"
              : "bg-white/90 text-[#17634f] hover:bg-white dark:border dark:border-[#3a6673] dark:bg-[#0b2233]/90 dark:text-white dark:hover:border-[#55d4aa] dark:hover:text-[#55d4aa]"
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
    </div>
  );
};

export default Property;
