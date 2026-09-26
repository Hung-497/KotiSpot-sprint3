import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapPin,
  Heart,
  Mail,
  BedDouble,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import houseImage from "../assets/house1.jpg";
import { apiRequest } from "../services/api";

const PropertyInfo = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      setCurrentImage(0);

      try {
        const data = await apiRequest(`/properties/${id}`);
        setSelectedProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <p className="px-6 py-10 text-center text-sm text-gray-500">
        Loading property...
      </p>
    );
  }

  if (error || !selectedProperty) {
    return (
      <p
        role="alert"
        className="mx-auto my-10 max-w-xl rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700"
      >
        {error || "Property information is unavailable."}
      </p>
    );
  }

  // Main image first, then the rest in the order they were added
  const images =
    selectedProperty.images?.length > 0
      ? [
          ...selectedProperty.images.filter((image) => image.isMain),
          ...selectedProperty.images.filter((image) => !image.isMain),
        ].map((image) => image.url)
      : [houseImage];

  const showPreviousImage = () => {
    setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const showNextImage = () => {
    setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
  };

  const isFavorite = favorites.includes(selectedProperty.id);
  const isRental = selectedProperty.listingType === "rent";
  const rentalDetails = selectedProperty.rentalDetails;

  const toggleFavorite = () => onToggleFavorite(selectedProperty.id);

  const contactSeller = () => {
    setInquirySent(false);
    setFormError("");
    setIsInquiryFormOpen(!isInquiryFormOpen);
  };

  const submitInquiry = async (event) => {
    event.preventDefault();

    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      setFormError("Please fill in your name, email, and message.");
      return;
    }

    if (!inquiryEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await apiRequest(`/inquiries/${selectedProperty.id}`, {
        method: "POST",
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          message: inquiryMessage,
        }),
      });

      setInquirySent(true);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryMessage("");
    } catch (error) {
      console.error("Error sending inquiry:", error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative">
              <img
                src={images[currentImage] || images[0]}
                onError={(event) => {
                  event.target.src = houseImage;
                }}
                alt={selectedProperty.title}
                className="h-105 w-full rounded-xl object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#08243f] shadow hover:bg-white"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#08243f] shadow hover:bg-white"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {currentImage + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={imageUrl}
                      onError={(event) => {
                        event.target.src = houseImage;
                      }}
                      alt="property"
                      className={`h-20 w-full rounded-lg object-cover ${
                        index === currentImage
                          ? "ring-2 ring-[#17634f]"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-300 bg-white p-6">
            <h1 className="text-2xl font-bold text-[#08243f]">
              {selectedProperty.address}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>
                {selectedProperty.city}, {selectedProperty.postalCode}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-medium text-[#08243f]">
              {selectedProperty.price} €{isRental && " / month"}
            </h2>

            <hr className="my-5 border-gray-300" />

            <h2 className="text-lg font-semibold text-[#08243f]">
              Property information
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>Property type: {selectedProperty.propertySubType}</p>

              <p>Area: {selectedProperty.size} m²</p>

              <p>Listing type: {isRental ? "For rent" : "For sale"}</p>

              {isRental && rentalDetails && (
                <>
                  <p>Available from: {rentalDetails.availableFrom}</p>

                  <p>
                    Minimum rental period: {rentalDetails.minimumRentalPeriod}{" "}
                    months
                  </p>

                  {rentalDetails.deposit && (
                    <p>Security deposit: {rentalDetails.deposit} €</p>
                  )}

                  {rentalDetails.additionalCosts && (
                    <p>Additional costs: {rentalDetails.additionalCosts}</p>
                  )}
                </>
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

            {isInquiryFormOpen && (
              <div className="mt-4 rounded-lg border border-gray-200 p-4">
                {inquirySent ? (
                  <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                    Your message has been sent. The seller or agent will get
                    back to you soon.
                  </p>
                ) : (
                  <form onSubmit={submitInquiry} className="space-y-3">
                    {formError && (
                      <p
                        role="alert"
                        className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {formError}
                      </p>
                    )}

                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="mb-1 block text-xs font-medium text-[#08243f]"
                      >
                        Your name
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        value={inquiryName}
                        onChange={(event) => setInquiryName(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="mb-1 block text-xs font-medium text-[#08243f]"
                      >
                        Your email
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        value={inquiryEmail}
                        onChange={(event) =>
                          setInquiryEmail(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="mb-1 block text-xs font-medium text-[#08243f]"
                      >
                        Message
                      </label>
                      <textarea
                        id="inquiry-message"
                        value={inquiryMessage}
                        onChange={(event) =>
                          setInquiryMessage(event.target.value)
                        }
                        rows="3"
                        placeholder={`Hi, I'm interested in ${selectedProperty.title || "this property"}...`}
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-[#17634f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#12503f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  </form>
                )}
              </div>
            )}
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
