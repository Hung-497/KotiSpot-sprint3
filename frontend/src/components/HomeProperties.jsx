import Property from "./HomeProperty";
import { useState } from "react";
import ComparisonActions from "./ComparisonActions";

const HomeProperties = ({ properties, favorites, onToggleFavorite }) => {
    const [selectedProperties, setSelectedProperties] = useState([]);
    return (
        <div>
            <ul className="properties">
                {properties.map((property) => (
                    <li key={property.id} className="flex">
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
    )
}
export default HomeProperties
