import PropertySkeletons from "./PropertySkeletons";
import Property from "./Property";
import { useState } from "react";
import ComparisonActions from "./ComparisonActions";

const Properties = ({ properties, favorites, onToggleFavorite, isLoading = false }) => {
  const [selectedProperties, setSelectedProperties] = useState([]);

  if (isLoading) return <PropertySkeletons />;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <li key={property.id}>
            <Property
              property={property}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
            />
          </li>
        ))}
      </ul>
      <ComparisonActions
        selectedProperties={selectedProperties}
        onClear={() => setSelectedProperties([])}
      />
    </div>
  );
};

export default Properties;
