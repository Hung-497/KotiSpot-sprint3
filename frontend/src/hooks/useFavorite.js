import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

const useFavorites = (authToken, isLoggedIn) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!authToken) {
        setFavorites([]);
        return;
      }

      try {
        const data = await apiRequest("/favourites");
        const favouriteIds = data
          .filter((item) => item.available && item.property)
          .map((item) => item.property.id);

        setFavorites(favouriteIds);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [authToken]);

  const toggleFavourite = async (propertyId) => {
    if (!isLoggedIn) {
      window.alert("Please log in to manage favorites.");
      return;
    }

    const isFavorite = favorites.includes(propertyId);

    try {
      await apiRequest(`/favourites/${propertyId}`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      setFavorites((currentFavorites) =>
        isFavorite
          ? currentFavorites.filter((id) => id !== propertyId)
          : [...currentFavorites, propertyId],
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  const resetFavorites = () => {
    setFavorites([]);
  };

  return { favorites, toggleFavourite, resetFavorites };
};

export default useFavorites;