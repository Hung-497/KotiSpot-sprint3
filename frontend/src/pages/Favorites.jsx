import Properties from "../components/Properties";

const Favorites = ({ properties: visibleProperties, favorites, onToggleFavorite }) => {
    const favoriteProperties = visibleProperties.filter((property) =>
        favorites.includes(property.id)
    );

    return (
        <div className="min-h-screen pb-30 bg-[#f8faf9] dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]">
            <h1 className="text-3xl px-10 pt-10 mb-7 font-bold text-[#08243f] dark:text-white"> Favorites</h1>
            {favoriteProperties.length === 0 ? (
                <p className="mx-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500 dark:border-[#315064] dark:bg-[#0b2233]/60 dark:text-[#a7b4be] dark:backdrop-blur-xl">
                    No favorite properties yet.
                </p>
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