import PropertySkeletons from "./PropertySkeletons";
import { useState } from "react"
import Properties from "./HomeProperties"
import PropertyTabs from "./PropertyTabs";

const DiscoverProperty = ({ properties: visibleProperties, favorites, onToggleFavorite, isLoading = false }) => {

    const [activeTab, setActiveTab] = useState("recommendations")
    const favoriteProperties = visibleProperties.filter((property) =>
        favorites.includes(property.id)
    );
    return (
        <div>
            <h3 className="text-sm text-[#08243f] dark:text-gray-200">Discover properties</h3>
            <div className="discover-property">
                <div className="propertyTabs mt-2 mb-4">
                    <PropertyTabs activeTab={activeTab} onChange={setActiveTab} />
                </div>

                {isLoading ? <PropertySkeletons home /> : activeTab === "recommendations" ? (
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
