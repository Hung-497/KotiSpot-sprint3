import { useLocation } from "react-router-dom";
import Property from "../components/Property";

const Results = ({ favorites, onToggleFavorite }) => {
    const location = useLocation();
    const results = location.state?.properties || [];

    return (
        <div>
            <h1>Search Results</h1>

            <div className="properties">
                {results.length === 0 ? (
                    <p>No results found</p>
                ) : (
                    results.map((property) => (
                        <Property key={property.id} property={property} favorites={favorites} onToggleFavorite={onToggleFavorite} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Results;