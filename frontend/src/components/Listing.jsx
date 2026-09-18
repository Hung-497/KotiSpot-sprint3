const Listing = ({ listing, onClick }) => {
    const price =
        listing.listingType === "forRent"
            ? `€${listing.monthlyRent} / month`
            : `€${listing.price}`;

    const hasPhotos = Array.isArray(listing.photos) && listing.photos.length > 0;

    return (
        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            {hasPhotos ? (
                <img
                    src={URL.createObjectURL(listing.photos[0])}
                    alt={listing.title}
                    className="h-52 w-full object-cover"
                />
            ) : (
                <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-100 text-sm font-medium text-slate-500">
                    No image
                </div>
            )}

            <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold leading-snug text-[#08243f]">
                    {listing.title}
                </h3>

                <p className="text-sm text-slate-500">{listing.address}</p>
                <p className="text-sm text-slate-500">{listing.location}</p>

                <div className="pt-2 text-base font-bold text-[#17634f]">
                    {price}
                </div>
            </div>
        </div>
    );
};

export default Listing;