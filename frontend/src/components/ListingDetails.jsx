const ListingDetails = ({ listing, onClose }) => {
    return (
        <div className="listing-details">
            <h2>{listing.title}</h2>

            {listing.photos.length > 0 && (
                <div>
                    {listing.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(photo)}
                            alt={`${listing.title} ${index + 1}`}
                            className="listing-detail-image"
                        />
                    ))}
                </div>
            )}

            <p>Location: {listing.location}</p>
            <p>Address: {listing.address}</p>
            <p>Postal code: {listing.postalCode}</p>
            <p>Property type: {listing.propertyType}</p>

            <p>Rooms: {listing.rooms}</p>
            <p>Bedrooms: {listing.bedrooms}</p>
            <p>Bathrooms: {listing.bathrooms}</p>
            <p>Size: {listing.size} m²</p>

            <p>Condition: {listing.condition}</p>

            <p>Description: {listing.description}</p>

            <p>Available from: {listing.availableFrom}</p>

            <h3>Features</h3>

            {listing.features.map((feature) => (
                <span key={feature}>
                    {feature}{" "}
                </span>
            ))}

            {listing.listingType === "forRent" && (
                <div>
                    <h3>Rental details</h3>

                    <p>
                        Monthly rent: €{listing.monthlyRent}
                    </p>

                    <p>
                        Security deposit: €{listing.securityDeposit}
                    </p>

                    <p>
                        Minimum rental period:{" "}
                        {listing.minimumRentalPeriod}
                    </p>

                    <p>
                        Additional costs: €{listing.additionalCosts}
                    </p>
                </div>
            )}

            {listing.listingType === "forSale" && (
                <div>
                    <h3>Sale details</h3>

                    <p>
                        Price: €{listing.price}
                    </p>
                </div>
            )}

            <button onClick={onClose}>
                Close
            </button>
        </div>
    );
};

export default ListingDetails;