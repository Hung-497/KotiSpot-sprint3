import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import houseImage from "../assets/house1.jpg";
import darkHouseImage from "../assets/house1_dark.png";
import { getMainImage } from "../utils/imageUtils";
import { formatPrice } from "../utils/formatPrice";
import PageLoader from "../components/PageLoader";
import { MAX_COMPARISON_PROPERTIES } from "../components/ComparisonActions";

const ComparisonPhoto = ({ property }) => {
  const image = getMainImage(property);
  const [failed, setFailed] = useState(false);
  const alt = image?.description || property.title || property.address;
  const imageClass = "aspect-[6/5] w-full object-cover";

  return (
    <div className="overflow-hidden rounded-control bg-surface-muted">
      {image?.url && !failed ? (
        <img src={image.url} alt={alt} onError={() => setFailed(true)} className={imageClass} />
      ) : (
        <>
          <img src={houseImage} alt={alt} className={`${imageClass} dark:hidden`} />
          <img src={darkHouseImage} alt={alt} className={`${imageClass} hidden dark:block`} />
        </>
      )}
    </div>
  );
};

const isRentalListing = (property) =>
  property.listingType === "rent" || property.listingType === "forRent";

const formatSubtype = (value) =>
  value ? value.replaceAll("-", " ").replace(/^\w/, (letter) => letter.toUpperCase()) : "-";

const PropertySummary = ({ property }) => (
  <div className="min-w-0 font-normal">
    <Link to={`/properties/${property.id}`} className="block rounded-control">
      <ComparisonPhoto property={property} />
    </Link>

    <span className="mt-3 inline-block rounded px-2 py-1 text-[10px] font-semibold leading-4 bg-pine-50 text-pine-700">
      {isRentalListing(property) ? "For rent" : "For sale"}
    </span>

    <Link
      to={`/properties/${property.id}`}
      className="mt-2 block text-sm font-semibold leading-5 text-ink hover:text-pine-700"
    >
      {property.address || property.title}
    </Link>
    <p className="mt-1 text-xs leading-5 text-ink-muted">{property.city || "-"}</p>

    <p className="mt-3 text-lg font-bold leading-6 text-ink tabular-nums">
      {formatPrice(property.price)}
      {isRentalListing(property) && (
        <span className="block text-xs font-normal text-ink-muted">/ month</span>
      )}
    </p>
    <p className="mt-1.5 text-[11px] leading-5 text-ink-muted">
      {formatSubtype(property.propertySubType)}
      {property.size != null && <> · {property.size} m²</>}
    </p>
  </div>
);

const FeatureValue = ({ value }) =>
  value ? (
    <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 font-medium text-pine-700">
      <Check size={16} strokeWidth={2.5} aria-hidden="true" />
      Yes
    </span>
  ) : (
    <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 text-ink-subtle">
      <X size={16} strokeWidth={2} aria-hidden="true" />
      No
    </span>
  );

const sections = [
  {
    title: "Space & layout",
    rows: [
      { label: "Living area", render: (p) => p.size != null ? `${p.size} m²` : "-" },
      { label: "Rooms", render: (p) => p.rooms != null ? `${p.rooms} ${p.rooms === 1 ? "room" : "rooms"}` : "-" },
      { label: "Bedrooms", render: (p) => p.bedrooms ?? "-" },
      { label: "Bathrooms", render: (p) => p.bathrooms ?? "-" },
    ],
  },
  {
    title: "Property details",
    rows: [
      { label: "Property subtype", render: (p) => formatSubtype(p.propertySubType) },
      { label: "Listing type", render: (p) => (isRentalListing(p) ? "For rent" : "For sale") },
      { label: "Billing period", render: (p) => (isRentalListing(p) ? "Monthly" : "-") },
    ],
  },
  {
    title: "Features",
    rows: [
      { label: "Balcony", render: (p) => <FeatureValue value={p.features?.balcony} /> },
      { label: "Elevator", render: (p) => <FeatureValue value={p.features?.elevator} /> },
      { label: "Parking", render: (p) => <FeatureValue value={p.features?.parking} /> },
      { label: "Furnished", render: (p) => <FeatureValue value={p.features?.furnished} /> },
      { label: "Pets allowed", render: (p) => <FeatureValue value={p.features?.petsAllowed} /> },
      { label: "Sauna", render: (p) => <FeatureValue value={p.features?.sauna} /> },
    ],
  },
  {
    title: "Description",
    rows: [
      {
        label: "Description",
        render: (p) => <span className="block max-w-prose leading-6 text-ink-muted">{p.description || "-"}</span>,
      },
    ],
  },
];

const labelCellClass =
  "sticky left-0 z-10 bg-surface px-3 py-3.5 text-xs font-normal leading-5 text-ink-muted lg:static lg:px-4";

const Comparison = ({ properties, isLoading = false }) => {
  const location = useLocation();
  const selectedProperties = Array.isArray(location.state?.selectedProperties)
    ? [...new Set(location.state.selectedProperties)]
    : [];
  const returnTo = ["/", "/buy", "/rent", "/favorites"].includes(location.state?.returnTo)
    ? location.state.returnTo
    : "/buy";
  const availableProperties = properties.filter((property) =>
    selectedProperties.includes(property.id),
  );
  const compareProperties = availableProperties.slice(0, MAX_COMPARISON_PROPERTIES);

  const backLink = (
    <Link to={returnTo} className="ks-btn ks-btn-secondary mb-6 min-h-11">
      <ArrowLeft size={16} aria-hidden="true" />
      Back to properties
    </Link>
  );

  if (isLoading) return <PageLoader label="Loading comparison..." fullPage />;

  if (compareProperties.length === 0) {
    return (
      <main className="ks-container py-8 md:py-12">
        {backLink}
        <h1 className="ks-page-title">Compare Properties</h1>
        <p className="ks-notice mt-6">
          {selectedProperties.length
            ? "The selected properties are no longer available. Choose other properties to compare."
            : `Select between 2 and ${MAX_COMPARISON_PROPERTIES} properties using the Compare checkboxes on the homepage, Buy, Rent or Favorites.`}
        </p>
      </main>
    );
  }

  return (
    <main className="ks-container py-8 md:py-12">
      {backLink}
      <h1 className="ks-page-title mb-6">Compare Properties</h1>

      {availableProperties.length < selectedProperties.length && (
        <p role="status" className="ks-notice mb-6">Some selected properties are no longer available.</p>
      )}

      {availableProperties.length > MAX_COMPARISON_PROPERTIES && (
        <p role="alert" className="ks-notice mb-6">
          You can compare up to {MAX_COMPARISON_PROPERTIES} properties. Only the first {MAX_COMPARISON_PROPERTIES} are shown.
        </p>
      )}

      <p id="comparison-scroll-hint" className="mb-3 text-xs leading-5 text-ink-muted lg:hidden">
        Swipe sideways to compare {compareProperties.length} {compareProperties.length === 1 ? "property" : "properties"}.
      </p>

      <div
        className="overflow-x-auto overscroll-x-contain rounded-2xl border border-line bg-surface lg:overflow-hidden"
        role="region"
        aria-label="Property comparison table"
        aria-describedby="comparison-scroll-hint"
        tabIndex={0}
      >
        <table
          className="w-full min-w-(--comparison-width) table-fixed border-separate border-spacing-0 text-sm text-ink wrap-anywhere [&_th]:border-b [&_th]:border-line [&_td]:border-b [&_td]:border-line lg:min-w-0"
          style={{ "--comparison-width": `${128 + compareProperties.length * 176}px` }}
        >
          <caption className="sr-only">Compare property prices, sizes, rooms and features side by side.</caption>
          <colgroup>
            <col className="w-32" />
            {compareProperties.map((property) => (
              <col key={property.id} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={`${labelCellClass} text-center align-middle`}>
                Your shortlist
              </th>

              {compareProperties.map((property) => (
                <th scope="col" key={property.id} className="px-3 pb-4 pt-3 text-left align-top lg:px-4 lg:pt-4">
                  <PropertySummary property={property} />
                </th>
              ))}
            </tr>
          </thead>

          {sections.map((section, sectionIndex) => (
            <tbody key={section.title || sectionIndex}>
              {section.title && (
                <tr className="border-b border-line bg-surface-muted/60">
                  <th
                    scope="colgroup"
                    colSpan={compareProperties.length + 1}
                    className="py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink"
                  >
                    <span className="sticky left-0 inline-block px-3 lg:static lg:px-4">{section.title}</span>
                  </th>
                </tr>
              )}

              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className={`${labelCellClass} text-left align-top`}>
                    {row.label}
                  </th>
                  {compareProperties.map((property) => (
                    <td key={property.id} className="px-3 py-3.5 align-top leading-5 lg:px-4">
                      {row.render(property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </main>
  );
};

export default Comparison;
