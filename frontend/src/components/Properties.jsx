import Property from "./Property";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Properties = ({ properties, favorites, setFavorites }) => {
    const [selectedProperties, setSelectedProperties] = useState([]);
    const navigate = useNavigate();
    const goToCompare = () => {

    navigate("/Comparison", {
      state: { selectedProperties: selectedProperties }
    });

  };

    return (
        <div>
        <ul className="properties">
            {properties.map((property) => (
                <Property 
                key={property.id} 
                property={property} 
                favorites={favorites} 
                setFavorites={setFavorites} 
                selectedProperties={selectedProperties}
                setSelectedProperties={setSelectedProperties}
                 />
            ))}
        </ul>

        {selectedProperties.length >= 2&& (
        <button
            type ="button"
            onClick={goToCompare}
            className="mt-5 rounded-lg bg-[#17634f] px-5 py-2 text-white"
        >
            Compare {selectedProperties.length} properties
        </button>

        )}
    </div>

    );
};
export default Properties