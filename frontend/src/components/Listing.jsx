// picks a badge color for each possible listing status
const getStatusColor = (status) => {
    if (status === "inactive") {
        return "bg-slate-100 text-slate-600";
    } else if (status === "sold") {
        return "bg-red-50 text-red-600";
    } else if (status === "rented") {
        return "bg-amber-50 text-amber-700";
    } else {
        return "bg-emerald-50 text-emerald-700";
    }
};

const Listing = ({ listing }) => {
    let price = `€${listing.price}`;
    if (listing.listingType === "forRent" || listing.listingType === "rent") {
        price = `€${listing.price} / month`;
    }

    const status = listing.status || "active";

    const hasPhotos = listing.photos && listing.photos.length > 0;

    return (
        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
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

                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold leading-snug text-[#08243f]">
                    {listing.title}
                </h3>

                <p className="text-sm text-slate-500">{listing.address}</p>
                <p className="text-sm text-slate-500">{listing.city}</p>

                <div className="pt-2 text-base font-bold text-[#17634f]">
                    {price}
                </div>
            </div>
        </div>
    );
};

export default Listing;