import Properties from "../components/Properties"; 
import PropertySearch from "../components/PropertySearch"; 
import { Star, Heart } from "lucide-react"; 
import { useState } from "react"; 
 
const Rent = ({ properties, favorites, onToggleFavorite }) => { 
  const forRentProperties = properties.filter( 
    (property) => property.listingType === "rent", 
  ); 
  const [filteredProperties, setFilteredProperties] = useState(null); 
 
  const visibleProperties = filteredProperties ?? forRentProperties; 
 
  const [activeTab, setActiveTab] = useState("recommendations"); 
  const displayedProperties = 
    activeTab === "favorites" 
      ? visibleProperties.filter((property) => favorites.includes(property.id)) 
      : visibleProperties; 
 
  return ( 
    <div className="Heading min-h-screen bg-[#f8faf9] dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]"> 
      <div className="mx-auto max-w-6xl px-6 py-10"> 
        <h1 className="text-3xl font-bold text-[#08243f] dark:text-white"> 
          Find a home <span className="text-[#12a77d] dark:text-[#45e0b0]">to rent</span> 
        </h1> 
 
        <p className="mt-2 text-gray-500 dark:text-[#a7b4be]"> 
          Search rental properties across Finland. 
        </p> 
 
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b2233]/75 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]"> 
          <p className="mb-3 text-sm font-medium text-[#08243f] dark:text-white"> 
            Search for a house to rent 
          </p> 
 
          <PropertySearch 
            properties={forRentProperties} 
            onResults={setFilteredProperties} 
            placeholder="Search city, neighborhood or postal code" 
          /> 
        </div> 
 
        <div className="Discover mt-10"> 
          <h2 className="text-2xl font-bold text-[#08243f] dark:text-white"> 
            Discover properties 
          </h2> 
 
          <div className="mt-4 flex gap-5"> 
            <button 
              type="button" 
              onClick={() => setActiveTab("recommendations")} 
              className={ 
                activeTab === "recommendations" 
                  ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white dark:bg-[#20c997] dark:text-[#06241d] dark:shadow-[0_0_20px_rgba(32,201,151,0.18)]" 
                  : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f] dark:border dark:border-white/10 dark:bg-[#102b3b] dark:text-[#d7e1e7] dark:hover:bg-[#153748]" 
              } 
            > 
              <Star 
                size={16} 
                fill={activeTab === "recommendations" ? "currentColor" : "none"} 
              /> 
              Recommended 
            </button> 
 
            <button 
              type="button" 
              onClick={() => setActiveTab("favorites")} 
              className={ 
                activeTab === "favorites" 
                  ? "flex items-center gap-2 rounded-full bg-[#17634f] px-5 py-2 text-xs font-medium text-white dark:bg-[#20c997] dark:text-[#06241d] dark:shadow-[0_0_20px_rgba(32,201,151,0.18)]" 
                  : "flex items-center gap-2 rounded-full bg-[#eef6f2] px-5 py-2 text-xs font-medium text-[#08243f] dark:border dark:border-white/10 dark:bg-[#102b3b] dark:text-[#d7e1e7] dark:hover:bg-[#153748]" 
              } 
            > 
              <Heart 
                size={16} 
                fill={activeTab === "favorites" ? "currentColor" : "none"} 
              /> 
              Favourites 
            </button> 
          </div> 
        </div> 
 
        <div className="Properties mt-6"> 
          {activeTab === "favorites" && displayedProperties.length === 0 ? ( 
            <p className="dark:text-[#a7b4be]">No favourite properties yet.</p> 
          ) : ( 
            <Properties 
              properties={displayedProperties} 
              favorites={favorites} 
              onToggleFavorite={onToggleFavorite} 
            /> 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default Rent; 