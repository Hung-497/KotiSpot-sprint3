import { useEffect, useState } from "react";
import { Check, Flag, MapPin, ShieldCheck, Trash2, X } from "lucide-react";
import { apiRequest } from "../services/api";
import houseImage from "../assets/house1.jpg";

const statusStyles = {
  active: "bg-green-50 text-green-700",
  approved: "bg-green-50 text-green-700",
  flagged: "bg-amber-50 text-amber-700",
  removed: "bg-red-50 text-red-700",
};

const AdminPanel = ({ onModerationUpdated }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await apiRequest("/moderation/properties");
        setProperties(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const chooseAction = (action) => {
    setPendingAction(action);
    setReason("");
  };

  const confirmAction = async () => {
    if (!selectedProperty || !pendingAction) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError("A moderation reason is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const updatedProperty = await apiRequest(
        `/moderation/properties/${selectedProperty.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: pendingAction,
            reason: trimmedReason,
          }),
        },
      );

      setProperties((current) =>
        current.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property,
        ),
      );

      onModerationUpdated(updatedProperty);

      setSelectedProperty(null);
      setPendingAction(null);
      setReason("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDetails = () => {
    setSelectedProperty(null);
    setPendingAction(null);
    setReason("");
  };

  return (
    <main className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[2px] text-[#17634f]">
              Moderation
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#08243f]">
              Admin panel
            </h1>
            <p className="mt-2 text-gray-500">
              Review every property listing and record its moderation status.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={18} className="text-[#17634f]" />
            {properties.length} listings to review
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-8 text-gray-500">Loading moderation listings...</p>
        )}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const moderation = property.moderation;
            const status = moderation?.status || "unreviewed";
            const isRental = property.listingType === "rent";

            const image =
              property.images?.find((image) => image.isMain)?.url ||
              property.images?.[0]?.url ||
              houseImage;

            return (
              <button
                key={property.id}
                type="button"
                onClick={() => setSelectedProperty(property)}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#17634f] hover:shadow-md"
              >
                <img
                  src={image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-[#08243f]">
                      {property.title}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status] || statusStyles.active}`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={15} />
                    {property.city}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#08243f]">
                    {property.price} €{isRental ? " / month" : ""}
                  </p>
                  {moderation?.reason && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                      Reason: {moderation.reason}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08243f]/40 px-6 py-8"
          role="presentation"
          onClick={closeDetails}
        >
          <div
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <p className="text-sm text-gray-500">Property details</p>
                <h2
                  id="property-details-title"
                  className="mt-1 text-2xl font-bold text-[#08243f]"
                >
                  {selectedProperty.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close property details"
                onClick={closeDetails}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#08243f]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
              <img
                src={
                  selectedProperty.images?.find((image) => image.isMain)?.url ||
                  selectedProperty.images?.[0]?.url ||
                  houseImage
                }
                alt={selectedProperty.title}
                className="h-48 w-full rounded-lg object-cover"
              />
              <div className="space-y-3 text-sm text-gray-600">
                <p className="text-xl font-semibold text-[#08243f]">
                  {selectedProperty.price} €
                  {selectedProperty.listingType === "rent" ? " / month" : ""}
                </p>
                <p>
                  <strong className="text-[#08243f]">Address:</strong>{" "}
                  {selectedProperty.address}, {selectedProperty.city}
                </p>
                <p>
                  <strong className="text-[#08243f]">Listing type:</strong>{" "}
                  {selectedProperty.listingType}
                </p>
                <p>
                  <strong className="text-[#08243f]">Size:</strong>{" "}
                  {selectedProperty.size} m²
                </p>
                <p>{selectedProperty.description}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <p className="text-sm font-semibold text-[#08243f]">
                Choose a moderation action
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => chooseAction("approved")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700"
                >
                  <Check size={17} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => chooseAction("flagged")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600"
                >
                  <Flag size={17} /> Flag
                </button>
                <button
                  type="button"
                  onClick={() => chooseAction("removed")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Trash2 size={17} /> Remove
                </button>
              </div>

              {pendingAction && (
                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-[#08243f]">
                    Confirm marking this property as{" "}
                    <strong className="capitalize">{pendingAction}</strong>.
                  </p>
                  <label
                    htmlFor="moderation-reason"
                    className="mt-3 block text-sm font-medium text-[#08243f]"
                  >
                    Reason *
                  </label>
                  <textarea
                    id="moderation-reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows="3"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
                    placeholder="Add a note for the moderation decision"
                  />
                  <div className="mt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setPendingAction(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-[#08243f]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting || !reason.trim()}
                      onClick={confirmAction}
                      className="rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#12503f] disabled:opacity-60"
                    >
                      {isSubmitting ? "Saving..." : "Confirm action"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;
