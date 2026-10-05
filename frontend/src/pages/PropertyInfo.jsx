import PageLoader from "../components/PageLoader";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyMap from "../components/PropertyMap";
import PropertyReviews from "../components/PropertyReviews";
import PropertyGallery from "../components/PropertyGallery";
import {
  MapPin,
  Heart,
  Mail,
  BedDouble,
  Bath,
  Maximize,
  DoorOpen,
  Check,
} from "lucide-react";
import { apiRequest } from "../services/api";

const featureLabels = [
  ["balcony", "Balcony"],
  ["elevator", "Elevator"],
  ["parking", "Parking"],
  ["furnished", "Furnished"],
  ["petsAllowed", "Pets allowed"],
  ["sauna", "Sauna"],
];

const PropertyInfo = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

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

      try {
        const data = await apiRequest(`/properties/${id}`);
        setSelectedProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const getLonLat = async () => {
      setLongitude(null);
      setLatitude(null);

      try {
        const encoder = await apiRequest(`/properties/geocode/${id}`);
        setLongitude(Number(encoder.longitude));
        setLatitude(Number(encoder.latitude));
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    };
    fetchProperty();
    getLonLat();
  }, [id]);

  if (loading) {
    return <PageLoader label="Loading property…" fullPage />;
  }

  if (error || !selectedProperty) {
    return (
      <p
        role="alert"
        className="mx-auto my-10 max-w-xl rounded-control bg-danger-soft px-4 py-3 text-center text-sm text-danger"
      >
        {error || "Property information is unavailable."}
      </p>
    );
  }

  const isFavorite = favorites.includes(selectedProperty.id);
  const isRental = selectedProperty.listingType === "rent";
  const rentalDetails = selectedProperty.rentalDetails;
  const stats = [
    { Icon: BedDouble, value: selectedProperty.bedrooms, label: "Bedrooms" },
    { Icon: Bath, value: selectedProperty.bathrooms, label: "Bathrooms" },
    { Icon: Maximize, value: `${selectedProperty.size} m²`, label: "Living area" },
    { Icon: DoorOpen, value: selectedProperty.rooms, label: "Rooms" },
  ];
  const listedFeatures = featureLabels.filter(
    ([key]) => selectedProperty.features?.[key],
  );

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
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <PropertyGallery key={selectedProperty.id} property={selectedProperty} />
          </div>

          <div className="rounded-card border border-line bg-surface p-4 sm:p-6">
            <h1 className="ks-page-title">
              {selectedProperty.address}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-ink-muted">
              <MapPin size={18} />
              <span>
                {selectedProperty.city}, {selectedProperty.postalCode}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-medium sm:text-3xl text-ink">
              {selectedProperty.price} €{isRental && " / month"}
            </h2>

            <hr className="my-5 border-line" />

            <h2 className="text-[22px] font-bold leading-tight text-ink">
              Property information
            </h2>

            <div className="mt-3 space-y-2 text-sm text-ink-muted">
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
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-control border border-line-strong px-4 py-3 text-sm text-ink transition hover:bg-surface-muted"
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />

              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            <button
              type="button"
              onClick={contactSeller}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-control bg-[#08243f] px-4 py-3 text-sm font-medium text-white transition hover:bg-pine-700"
            >
              <Mail size={18} />
              Contact seller or agent
            </button>

            {isInquiryFormOpen && (
              <div className="mt-4 rounded-control border border-line p-4">
                {inquirySent ? (
                  <p className="rounded-control bg-pine-50 px-4 py-3 text-sm text-pine-700">
                    Your message has been sent. The seller or agent will get
                    back to you soon.
                  </p>
                ) : (
                  <form onSubmit={submitInquiry} className="space-y-3" aria-busy={isSubmitting}>
                    {isSubmitting && <PageLoader label="Sending inquiry…" variant="spinner" />}
                    {formError && (
                      <p
                        role="alert"
                        className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
                      >
                        {formError}
                      </p>
                    )}

                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="mb-1 block text-xs font-medium text-ink"
                      >
                        Your name
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        value={inquiryName}
                        onChange={(event) => setInquiryName(event.target.value)}
                        className="ks-input w-full border text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="mb-1 block text-xs font-medium text-ink"
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
                        className="ks-input w-full border text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="mb-1 block text-xs font-medium text-ink"
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
                        className="ks-input w-full resize-none border text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ks-btn ks-btn-primary w-full text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-12">
          <section>
            <h2 className="text-[28px] font-bold leading-tight text-ink sm:text-[32px]">Property details</h2>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ Icon, value, label }) => (
                <div key={label} className="ks-card p-4">
                  <Icon size={18} aria-hidden="true" className="text-pine-700" />
                  <dd className="mt-2 text-lg font-semibold text-ink tabular-nums">
                    {value ?? "—"}
                  </dd>
                  <dt className="text-lg leading-7 text-ink-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-line-strong pt-12">
            <h2 className="text-[28px] font-bold leading-tight text-ink sm:text-[32px]">Features</h2>

            {listedFeatures.length > 0 ? (
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-base sm:text-lg leading-7 text-ink sm:grid-cols-3">
                {listedFeatures.map(([key, label]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                      <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-lg leading-7 text-ink-muted">
                No features listed.
              </p>
            )}
          </section>

          {selectedProperty.description && (
            <section className="border-t border-line-strong pt-12">
              <h2 className="text-[28px] font-bold leading-tight text-ink sm:text-[32px]">Description</h2>

              <p className="mt-3 w-full whitespace-normal text-lg leading-7 text-ink-muted">
                {selectedProperty.description}
              </p>
            </section>
          )}

          <PropertyReviews propertyId={selectedProperty.id} />
        </div>

        <div className="mt-12 border-t border-line-strong pt-12">
          <h2 className="mb-5 text-[28px] font-bold leading-tight text-ink sm:text-[32px]">Location</h2>
          {latitude !== null && longitude !== null ? (
            <PropertyMap
              latitude={latitude}
              longitude={longitude}
              address={selectedProperty.address}
            />
          ) : (
            <p className="text-sm text-gray-500">Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
