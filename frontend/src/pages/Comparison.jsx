import { useLocation } from "react-router-dom";

const Comparison = ({properties}) => {
  const location = useLocation();
  const selectedProperties =
    location.state?.selectedProperties || [];
  const compareProperties = properties.filter((property) =>
    selectedProperties.includes(property.id)
  );

  if (compareProperties.length === 0) {
    return (
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold">
          Compare Properties
        </h1>
        <p className="mt-5">
          No properties selected for comparison.
        </p>
      </div>
    );
  }


  return (
    <div className="px-10 py-10">

      <h1 className="text-3xl font-bold text-[#08243f] mb-10"> Compare Properties </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <tbody>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Property </td>

              {compareProperties.map((property) => (
                <td
                  key={property.id}
                  className="p-4"
                >

                  <img
                    src={property.images.filter((image) => image.isMain)}
                    alt={property.address}
                    className="w-60 h-40 object-cover rounded-xl"
                  />

                </td>

              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Address </td>
              {compareProperties.map((property) => (
                <td
                  key={property.id}
                  className="p-4 font-semibold"
                >
                  {property.address}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> City </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.city}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Price </td>
              {compareProperties.map((property) => (
                <td
                  key={property.id}
                  className="p-4 text-lg font-bold"
                >
                  {property.price} €
                  {property.listingType === "rent" ||
                  property.listingType === "forRent"
                    ? " / month"
                    : ""}

                </td>

              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Area </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.size} m²
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Listing type </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.listingType === "rent" ||
                  property.listingType === "forRent"
                    ? "For rent"
                    : "For sale"}

                </td>

              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Billing period </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.listingType === "rent" ||
                  property.listingType === "forRent"
                    ? "Monthly"
                    : "-"}

                </td>

              ))}

            </tr>

            <tr>
              <td
                colSpan={compareProperties.length + 1}
                className="pt-8 pb-3 text-xl font-bold text-[#08243f]">
                Property details
              </td>
            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Bedrooms </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.bedrooms ?? "-"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Bathrooms </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.bathrooms ?? "-"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Rooms </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.rooms ?? "-"}
                </td>
              ))}

            </tr>

            <tr>
              <td
                colSpan={compareProperties.length + 1}
                className="pt-8 pb-3 text-xl font-bold text-[#08243f]"
              >
                Features
              </td>
            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Balcony </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.features?.balcony ? "✓ Yes" : "✕ No"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Elevator </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.features?.elevator ? "✓ Yes" : "✕ No"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Parking </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.features?.parking ? "✓ Yes" : "✕ No"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Furnished </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.features?.furnished ? "✓ Yes" : "✕ No"}
                </td>
              ))}

            </tr>

            <tr className="border-b">

              <td className="p-4 font-semibold"> Pets allowed </td>
              {compareProperties.map((property) => (
                <td key={property.id} className="p-4">
                  {property.features?.petsAllowed ? "✓ Yes" : "✕ No"}
                </td>
              ))}

            </tr>

            <tr>
              <td
                colSpan={compareProperties.length + 1}
                className="pt-8 pb-3 text-xl font-bold text-[#08243f]"
              >
                Description
              </td>
            </tr>


            <tr>

              <td className="p-4 font-semibold"> Description </td>

              {compareProperties.map((property) => (
                <td
                  key={property.id}
                  className="p-4 align-top"
                >
                  {property.description || "-"}
                </td>

              ))}

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Comparison;