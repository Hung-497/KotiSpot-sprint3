import Property from "./Property";

const Properties = ({ properties, favorites, setFavorites }) => {
    return (
        <ul className="properties">
            {properties.map((property) => (
                <Property key={property.id} property={property} favorites={favorites} setFavorites={setFavorites} />
            ))}
        </ul>
    )
}
export default Properties