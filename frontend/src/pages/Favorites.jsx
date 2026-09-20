import Properties from "../components/Properties";

const Favorites = ({ properties, favorites, onToggleFavorite }) => {
    const favoriteProperties = properties.filter((property) =>
        favorites.includes(property.id)
    );

    return (
        <div className="pb-30">
            <h1 className="text-3xl px-10 mb-7 font-bold text-[#08243f]"> Favorites</h1>
            {favoriteProperties.length === 0 ? (
                <p>No favorite properties yet.</p>
            ) : (
                <Properties
                    properties={favoriteProperties}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}

                />
            )}
        </div>
    );
};

export default Favorites;