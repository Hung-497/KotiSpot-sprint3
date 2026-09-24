import { useLocation } from "react-router-dom";
import { MapPin, Heart, Mail, BedDouble, Bath, Maximize } from "lucide-react";
import houseImage from "../assets/house1.jpg";

const PropertyInfo = ({ property, favorites, onToggleFavorite }) => {
  const location = useLocation();
  const selectedProperty = property || location.state?.property;

  if (!selectedProperty) {
    return <p>Property information is unavailable.</p>;
  }

  const image =
    selectedProperty.images?.find((image) => image.isMain)?.url ||
    selectedProperty.images?.[0]?.url ||
    houseImage;

  const isFavorite = favorites.includes(selectedProperty.id);

  const toggleFavorite = () => {
    onToggleFavorite(selectedProperty.id);
  };

  const contactSeller = () => {
    console.log('You pressed the "contact seller or agent" button');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <img
              src={image}
              alt={selectedProperty.title}
              className="h-105 w-full rounded-xl object-cover"
            />

            <div className="mt-4 grid grid-cols-4 gap-3">
              <img
                src={image}
                alt="property"
                className="h-20 w-full rounded-lg border-2 border-blue-500 object-cover"
              />

              <img
                src={image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />

              <img
                src={image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />

              <img
                src={image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-300 bg-white p-6">
            <h1 className="text-2xl font-bold text-[#08243f]">
              {selectedProperty.address}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>{selectedProperty.city}</span>
            </div>

            <h2 className="mt-4 text-3xl font-medium text-[#08243f]">
              {selectedProperty.price} €
              {selectedProperty.listingType === "rent" && " / month"}
            </h2>

            <hr className="my-5 border-gray-300" />

            <h2 className="text-lg font-semibold text-[#08243f]">
              Property information
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>Area: {selectedProperty.size} m²</p>

              <p>
                Listing type:{" "}
                {selectedProperty.listingType === "rent"
                  ? "For rent"
                  : "For sale"}
              </p>

              {selectedProperty.listingType === "rent" && (
                <p>Billing period: Monthly</p>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFavorite}
              className="
                mt-5
                flex w-full
                items-center justify-center gap-2
                rounded-lg
                border border-gray-400
                px-4 py-3
                text-sm
                text-[#08243f]
                transition
                hover:bg-gray-50
              "
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />

              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            <button
              type="button"
              onClick={contactSeller}
              className="
                mt-3
                flex w-full
                items-center justify-center gap-2
                rounded-lg
                bg-[#08243f]
                px-4 py-3
                text-sm font-medium
                text-white
                transition
                hover:bg-[#17634f]
              "
            >
              <Mail size={18} />
              Contact seller or agent
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-[#08243f]">
              Property details:
            </h2>

            <div className="mt-4 flex overflow-hidden rounded-full border border-gray-300 bg-white">
              <div className="flex flex-1 items-center justify-center gap-2 border-r border-gray-300 px-4 py-3">
                <BedDouble size={18} />

                <span className="text-sm">
                  {selectedProperty.bedrooms} bedrooms
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center gap-2 border-r border-gray-300 px-4 py-3">
                <Bath size={18} />

                <span className="text-sm">
                  {selectedProperty.bathrooms} bathroom
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center gap-2 border-r border-gray-300 px-4 py-3">
                <Maximize size={18} />

                <span className="text-sm">{selectedProperty.size} m²</span>
              </div>

              <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                <span>🏠</span>

                <span className="text-sm">{selectedProperty.rooms} rooms</span>
              </div>
            </div>

            {selectedProperty.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-[#08243f]">Description</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {selectedProperty.description}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#08243f]">Features:</h2>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
              {selectedProperty.features?.balcony && <div>✓ Balcony</div>}

              {selectedProperty.features?.elevator && <div>✓ Elevator</div>}

              {selectedProperty.features?.parking && <div>✓ Parking</div>}

              {selectedProperty.features?.furnished && <div>✓ Furnished</div>}

              {selectedProperty.features?.petsAllowed && (
                <div>✓ Pets allowed</div>
              )}

              {selectedProperty.features?.sauna && <div>✓ Sauna</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
