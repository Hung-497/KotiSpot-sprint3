import { useState } from "react"
import Properties from "./Properties"
import { Star, Heart } from "lucide-react";

const DiscoverProperty = ({ properties: visibleProperties, favorites, onToggleFavorite }) => {

    const [activeTab, setActiveTab] = useState("recommendations")
    const favoriteProperties = visibleProperties.filter((property) =>
        favorites.includes(property.id)
    );
    return (
        <div>
            <h3>Discover properties</h3>
            <div className="discover-property">
                <div className="propertyTabs flex gap-3 mb-4 mt-2">
                    <button onClick={() => setActiveTab("recommendations")}
                    className={
                        activeTab === "recommendations"
                            ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white"
                            : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f]"
                    }
                    >
                    <Star size={16} fill={ activeTab === "recommendations" ? "currentColor" : "none"}/>
                        Recommended</button>

                    <button onClick={() => setActiveTab("favorites")}
                    className={
                        activeTab === "favorites"
                            ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white"
                            : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f]"
                    }
                    >
                    <Heart size={16} fill={activeTab === "favorites" ? "currentColor" : "none"}/>    
                        Favourites</button>
                </div>
                
                {activeTab === "recommendations" ? (
                    <Properties
                        properties={visibleProperties}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                    />
                ) : (
                    favoriteProperties.length === 0 ? (
                        <p>No favourite properties yet.</p>
                    ) : (
                        <Properties
                            properties={favoriteProperties}
                            favorites={favorites}
                            onToggleFavorite={onToggleFavorite}
                        />
                    )
                )}
            </div>
        </div>
    )
}
export default DiscoverProperty