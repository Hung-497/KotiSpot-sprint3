import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

const useProperties = (currentUserId) => {
  const [properties, setProperties] = useState([]);

  // Listings made by other people (you don't see your own listings here)
  const othersProperties = properties.filter(
    (property) => property.owner !== currentUserId,
  );

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await apiRequest("/properties");
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    };

    loadProperties();
    // Load again whenever someone logs in or out, so new listings show up
  }, [currentUserId]);

  const syncModeratedProperty = (updatedProperty) => {
    setProperties((currentProperties) => {
      const isPublic =
        updatedProperty.status === "active" &&
        updatedProperty.moderation?.status === "approved";

      const alreadyExists = currentProperties.some(
        (property) => property.id === updatedProperty.id,
      );

      if (!isPublic) {
        return currentProperties.filter(
          (property) => property.id !== updatedProperty.id,
        );
      }

      if (alreadyExists) {
        return currentProperties.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property,
        );
      }

      return [...currentProperties, updatedProperty];
    });
  };

  return { properties, othersProperties, syncModeratedProperty };
};

export default useProperties;