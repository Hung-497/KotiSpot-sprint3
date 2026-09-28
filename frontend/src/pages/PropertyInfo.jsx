import { useLocation, } from "react-router-dom";
import { MapPin, Heart, Mail, BedDouble, Bath, Maximize } from "lucide-react";
import PropertyMap from "../components/PropertyMap";
import { hosts, reviews } from "../../data";

const PropertyInfo = ({ property, favorites, setFavorites }) => {
  const location = useLocation();
  const selectedProperty = property || location.state?.property;

  if (!selectedProperty) {
    return <p>Property information is unavailable.</p>;
  }

  const host = hosts.find(
    (host) => host.id === selectedProperty.ownerId
  );

  const propertyReviews = reviews.filter(
    (review) => review.propertyId === selectedProperty.id
  );

  const averageRating =
    propertyReviews.length > 0
      ? (
          propertyReviews.reduce(
            (total, review) => total + review.rating,
            0
          ) / propertyReviews.length
        ).toFixed(1)
      : null;

  const isFavorite = favorites.includes(selectedProperty.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(
        favorites.filter((id) => id !== selectedProperty.id)
      );
    } else {
      setFavorites([
        ...favorites,
        selectedProperty.id
      ]);
    }
  };

  const contactSeller = () => {
    console.log('You pressed the "contact seller or agent" button');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              className="h-105 w-full rounded-xl object-cover"
            />

            <div className="mt-4 grid grid-cols-4 gap-3">

              <img
                src={selectedProperty.image}
                alt="property"
                className="h-20 w-full rounded-lg border-2 border-blue-500 object-cover"
              />

              <img
                src={selectedProperty.image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />

              <img
                src={selectedProperty.image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />

              <img
                src={selectedProperty.image}
                alt="property"
                className="h-20 w-full rounded-lg object-cover opacity-70"
              />

            </div>

            <div className="mt-8 max-w-3xl">

              <div className="border-b border-gray-300 pb-8">

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

                    <span className="text-sm">
                      {selectedProperty.size} m²
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                    <span>🏠</span>

                    <span className="text-sm">
                      {selectedProperty.rooms} rooms
                    </span>
                  </div>

                </div>

                {selectedProperty.description && (
                  <div className="mt-8">

                    <h3 className="text-2xl font-semibold text-[#08243f]">
                      Description
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {selectedProperty.description}
                    </p>

                  </div>
                )}

              </div>

              <div className="border-b border-gray-300 py-8">

                <h2 className="text-2xl font-semibold text-[#08243f]">
                  Features:
                </h2>

                <div className="mt-4 grid max-w-xl grid-cols-2 gap-4 text-sm text-gray-700">

                  {selectedProperty.features?.balcony && (
                    <div>✓ Balcony</div>
                  )}

                  {selectedProperty.features?.elevator && (
                    <div>✓ Elevator</div>
                  )}

                  {selectedProperty.features?.parking && (
                    <div>✓ Parking</div>
                  )}

                  {selectedProperty.features?.furnished && (
                    <div>✓ Furnished</div>
                  )}

                  {selectedProperty.features?.petsAllowed && (
                    <div>✓ Pets allowed</div>
                  )}

                  {selectedProperty.features?.sauna && (
                    <div>✓ Sauna</div>
                  )}

                </div>

              </div>

            </div>

            {host && (
              <div className="mt-3 max-w-3xl pt-8">

                <h2 className="text-2xl font-semibold text-[#08243f]">
                  Listed by
                </h2>

                <div className="mt-2 flex items-start gap-5">

                  {host.image ? (
                    <img
                      src={host.image}
                      alt={host.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08243f] text-xl font-bold text-white">
                      {host.name.charAt(0)}
                    </div>
                  )}

                  <div>

                    <h3 className="text-lg font-semibold text-[#08243f]">
                      {host.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {host.role}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Member since {host.joinedYear}
                    </p>

                    {host.description && (
                      <p className="mt-4 max-w-xl text-sm leading-6 text-gray-700">
                        {host.description}
                      </p>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

          <div className="self-start rounded-xl border border-gray-300 bg-white p-6 lg:sticky lg:top-24">

            <h1 className="text-2xl font-bold text-[#08243f]">
              {selectedProperty.address}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>{selectedProperty.city}</span>
            </div>

            <h2 className="mt-4 text-3xl font-medium text-[#08243f]">
              {selectedProperty.price} €
              {(selectedProperty.listingType === "rent" ||
                selectedProperty.listingType === "forRent") &&
                " / month"}
            </h2>

            <hr className="my-5 border-gray-300" />

            <h2 className="text-lg font-semibold text-[#08243f]">
              Property information
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-700">

              <p>
                Area: {selectedProperty.size} m²
              </p>

              <p>
                Listing type:{" "}
                {selectedProperty.listingType === "rent"
                  ? "For rent"
                  : "For sale"}
              </p>

              {selectedProperty.listingType === "rent" && (
                <p>
                  Billing period: Monthly
                </p>
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
              <Heart
                size={18}
                fill={isFavorite ? "currentColor" : "none"}
              />

              {isFavorite
                ? "Remove from favorites"
                : "Add to favorites"}
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

        <div className="mt-10 border-t border-gray-300 pt-8">

          <div className="flex items-center gap-3">

            <h2 className="text-2xl font-semibold text-[#08243f]">
              Reviews
            </h2>

            {averageRating && (
              <span className="text-lg font-medium text-gray-700">
                ★ {averageRating} · {propertyReviews.length} reviews
              </span>
            )}

          </div>

          {propertyReviews.length === 0 ? (

            <p className="mt-5 text-sm text-gray-500">
              No reviews yet.
            </p>

          ) : (

            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">

              {propertyReviews.map((review) => (

                <div key={review.id}>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-[#08243f]">
                      {review.userName.charAt(0)}
                    </div>

                    <div>

                      <p className="font-semibold text-[#08243f]">
                        {review.userName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {review.date}
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 text-sm">
                    {"★".repeat(review.rating)}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {review.comment}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-semibold text-[#08243f]">
            Location
          </h2>

          <PropertyMap />

        </div>

      </div>
    </div>
  );
};

export default PropertyInfo;