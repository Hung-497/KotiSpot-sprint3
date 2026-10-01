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
            <h3 className="text-sm text-[#08243f] dark:text-gray-200">Discover properties</h3>
            <div className="discover-property">
                <div className="propertyTabs flex gap-3 mb-4 mt-2">
                    <button onClick={() => setActiveTab("recommendations")}
                    className={
                        activeTab === "recommendations"
                            ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white transition-all dark:bg-[linear-gradient(135deg,#17a77c,#0f8b68)] dark:shadow-[0_4px_14px_rgba(23,167,124,0.25)]"
                            : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f] transition-all hover:bg-[#e1eee8] dark:border dark:border-[#31586a] dark:bg-transparent dark:text-gray-200 dark:hover:border-[#55d4aa] dark:hover:bg-[#102738]"
                    }
                    >
                    <Star size={16} fill={ activeTab === "recommendations" ? "currentColor" : "none"}/>
                        Recommended</button>

                    <button onClick={() => setActiveTab("favorites")}
                    className={
                        activeTab === "favorites"
                            ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white transition-all dark:bg-[linear-gradient(135deg,#17a77c,#0f8b68)] dark:shadow-[0_4px_14px_rgba(23,167,124,0.25)]"
                            : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f] transition-all hover:bg-[#e1eee8] dark:border dark:border-[#31586a] dark:bg-transparent dark:text-gray-200 dark:hover:border-[#55d4aa] dark:hover:bg-[#102738]"
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">No favourite properties yet.</p>
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