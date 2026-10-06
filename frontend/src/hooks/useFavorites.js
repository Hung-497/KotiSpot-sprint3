import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import useDialog from "./useDialog";

const useFavorites = (authToken, isLoggedIn) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(authToken));
  const { showAlert } = useDialog();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!authToken) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await apiRequest("/favourites");
        const favouriteIds = data
          .filter((item) => item.available && item.property)
          .map((item) => item.property.id);

        setFavorites(favouriteIds);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [authToken]);

  const toggleFavourite = async (propertyId) => {
    if (!isLoggedIn) {
      showAlert("Please log in to manage favorites.", "Log in required");
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
      showAlert(error.message, "Something went wrong");
    }
  };

  const resetFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isLoading: Boolean(authToken) && isLoading,
    toggleFavourite,
    resetFavorites,
  };
};

export default useFavorites;
