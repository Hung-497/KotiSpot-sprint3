import Property from "./Property";

const Properties = ({ properties, favorites, onToggleFavorite }) => {
    return (
        <ul className="properties">
            {properties.map((property) => (
                <Property key={property.id} property={property} favorites={favorites} onToggleFavorite={onToggleFavorite} />
            ))}
        </ul>
    )
}
export default Properties