import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

const useProperties = (currentUserId) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await apiRequest("/properties");
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
    // Load again whenever someone logs in or out, so new listings show up
  }, [currentUserId]);

  const syncModeratedProperty = (updatedProperty) => {
    setProperties((currentProperties) => {
      // Flagged listings stay public while an administrator investigates
      const isPublic =
        updatedProperty.status === "active" &&
        ["approved", "flagged"].includes(updatedProperty.moderation?.status);

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

  return { properties, isLoading, syncModeratedProperty };
};

export default useProperties;
