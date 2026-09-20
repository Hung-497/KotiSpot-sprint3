import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import houseImage from "../assets/house1.jpg";

const Property = ({ property, favorites, onToggleFavorite }) => {
    const isFavorite = favorites.includes(property.id);
    const { address, city, price, size, listingType } = property;
    const isRental = listingType === "rent" || listingType === "forRent";

    const image = property.image
        || (property.images && property.images.length > 0 ? property.images[0].url : houseImage);

    return (
        <div className="property-card w-52.5 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
            <div className="relative">

            <Link to="/propertyInfo" state={{ property }}>
                <img
                    src={image}
                    onError={(event) => { event.target.src = houseImage; }}
                    alt="house image"
                    className="h-28.75 w-full object-cover"
                />

                <div className="property-info">
                    <div>{address}</div>
                    <div> ⌖ {city}</div>
                    <div>{price} €{isRental ? " / month" : ""}</div>
                    <div>{size} m² </div>
                </div>
            </Link>

            <button
                type="button"
                aria-label={isFavorite ? "Remove property from favorites" : "Add property to favorites"}
                aria-pressed={isFavorite}
                className={`favorite-button absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105 ${
                    isFavorite
                        ? "bg-[#17634f] text-white hover:bg-[#12503f]"
                        : "bg-white/90 text-[#17634f] hover:bg-white"
                }`}
                onClick={() => onToggleFavorite(property.id)}
            >
                <Heart size={18} strokeWidth={2} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            </div>

        </div>
    );
};

export default Property;