import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Property from "../components/Property";

const Results = ({ favorites, onToggleFavorite }) => {
    const { keyword } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`/api/properties/search?keyword=${encodeURIComponent(keyword)}`);
                if (!res.ok) {
                    throw new Error("Failed to search properties. Please try again.");
                }
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Error searching properties:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [keyword]);

    if (loading) {
        return <p>Searching...</p>;
    }

    return (
        <div>
            <h1>Search Results</h1>

            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="properties">
                {!error && results.length === 0 ? (
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
