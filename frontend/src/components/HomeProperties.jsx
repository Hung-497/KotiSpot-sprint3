import Property from "./HomeProperty";
import { useState } from "react";
import ComparisonActions from "./ComparisonActions";

const HomeProperties = ({ properties, favorites, onToggleFavorite }) => {
    const [selectedProperties, setSelectedProperties] = useState([]);
    return (
        <div>
            <ul className="grid list-none grid-cols-1 gap-4 p-0 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property) => (
                    <li key={property.id} className="flex min-w-0">
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
