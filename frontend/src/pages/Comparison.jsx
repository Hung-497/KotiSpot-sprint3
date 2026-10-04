import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import houseImage from "../assets/house1.jpg";
import darkHouseImage from "../assets/house1_dark.png";
import { getMainImage } from "../utils/imageUtils";
import { formatPrice } from "../utils/formatPrice";
import PageLoader from "../components/PageLoader";

const ComparisonPhoto = ({ property }) => {
  const image = getMainImage(property);
  const [failed, setFailed] = useState(false);
  const alt = image?.description || property.title || property.address;
  const imageClass = "aspect-[4/3] w-full object-cover";

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

const FeatureValue = ({ value }) =>
  value ? (
    <span className="inline-flex items-center gap-1.5 font-medium text-pine-700">
      <Check size={16} strokeWidth={2.5} aria-hidden="true" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-ink-subtle">
      <X size={16} strokeWidth={2} aria-hidden="true" />
      No
    </span>
  );

const sections = [
  {
    rows: [
      { label: "Address", render: (p) => <span className="font-semibold text-ink">{p.address}</span> },
      { label: "City", render: (p) => p.city },
      {
        label: "Price",
        render: (p) => (
          <span className="text-lg font-bold text-ink tabular-nums">
            {formatPrice(p.price)}
            {isRentalListing(p) && <span className="ks-price-unit"> / month</span>}
          </span>
        ),
      },
      { label: "Area", render: (p) => `${p.size} m²` },
      { label: "Listing type", render: (p) => (isRentalListing(p) ? "For rent" : "For sale") },
      { label: "Billing period", render: (p) => (isRentalListing(p) ? "Monthly" : "-") },
    ],
  },
  {
    title: "Property details",
    rows: [
      { label: "Bedrooms", render: (p) => p.bedrooms ?? "-" },
      { label: "Bathrooms", render: (p) => p.bathrooms ?? "-" },
      { label: "Rooms", render: (p) => p.rooms ?? "-" },
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
  "sticky left-0 z-10 w-36 min-w-36 bg-surface px-4 py-3 text-left align-top text-sm font-medium text-ink-muted sm:w-44";

const Comparison = ({ properties, isLoading = false }) => {
  const location = useLocation();
  const selectedProperties = Array.isArray(location.state?.selectedProperties)
    ? location.state.selectedProperties
    : [];
  const returnTo = ["/", "/buy", "/rent", "/favorites"].includes(location.state?.returnTo)
    ? location.state.returnTo
    : "/buy";
  const compareProperties = properties.filter((property) =>
    selectedProperties.includes(property.id),
  );

  const backLink = (
    <Link to={returnTo} className="ks-btn ks-btn-secondary mb-6">
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
            : "Select at least two properties using the Compare checkboxes on the homepage, Buy, Rent or Favorites."}
        </p>
      </main>
    );
  }

  return (
    <main className="ks-container py-8 md:py-12">
      {backLink}
      <h1 className="ks-page-title mb-6">Compare Properties</h1>

      {compareProperties.length < selectedProperties.length && (
        <p role="status" className="ks-notice mb-6">Some selected properties are no longer available.</p>
      )}

      <div className="ks-card overflow-x-auto" role="region" aria-label="Property comparison table" tabIndex={0}>
        <table className="w-full border-collapse text-sm text-ink">
          <caption className="sr-only">Compare property prices, sizes, rooms and features side by side.</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={labelCellClass}>
                Property
              </th>

              {compareProperties.map((property) => (
                <th scope="col" key={property.id} className="min-w-56 px-4 py-4 text-left align-top">
                  <Link to={`/properties/${property.id}`} className="block rounded-control font-medium text-ink hover:text-pine-700">
                    <ComparisonPhoto property={property} />
                    <span className="mt-3 block">{property.address}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          {sections.map((section, sectionIndex) => (
            <tbody key={section.title || sectionIndex}>
              {section.title && (
                <tr className="border-b border-line bg-canvas">
                  <th
                    scope="colgroup"
                    colSpan={compareProperties.length + 1}
                    className="sticky left-0 px-4 pb-2.5 pt-5 text-left text-base font-semibold text-ink"
                  >
                    {section.title}
                  </th>
                </tr>
              )}

              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className={labelCellClass}>
                    {row.label}
                  </th>
                  {compareProperties.map((property) => (
                    <td key={property.id} className="px-4 py-3 align-top">
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
