import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import houseImage from "../assets/house1.jpg";
import { getMainImage } from "../utils/imageUtils";

const Property = ({ property, favorites, onToggleFavorite, selectedProperties = [], setSelectedProperties, }) => {
  const isFavorite = favorites.includes(property.id);
  const isSelected = selectedProperties.includes(property.id);
  const { address, city, price, size, listingType } = property;
  const isRental = listingType === "rent";
  const handleCompare = () => {
    if (isSelected) {
      setSelectedProperties(
        selectedProperties.filter(
          (id) => id !== property.id)
      );
    } else {
      setSelectedProperties([...selectedProperties, property.id]);
    }
  };
  const mainImage = getMainImage(property);

  return (
    <div className="property-card w-52.5 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img
            src={mainImage?.url || houseImage}
            onError={(event) => {
              event.currentTarget.src = houseImage;
            }}
            alt={mainImage?.description || property.title || "Property photo"}
            className="h-28.75 w-full object-cover"
          />

          <div className="property-info">
            <div>{address}</div>
            <div> ⌖ {city}</div>
            <div>
              {price} €{isRental ? " / month" : ""}
            </div>
            <div>{size} m² </div>
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
          className={`favorite-button absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105 ${isFavorite
              ? "bg-[#17634f] text-white hover:bg-[#12503f]"
              : "bg-white/90 text-[#17634f] hover:bg-white"
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
      <label className="flex w-full items-center gap-2 border-t px-3 py-2 cursor-pointer">

        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCompare}
        />
        Compare
      </label>
    </div>
  );
};

export default Property;
