import { apiRequest } from "./src/services/api";

// The backend fetches nearby places from Overpass and caches them, so the
// browser never talks to Overpass directly.
// This cache only stops duplicate calls in this tab (React StrictMode,
// revisiting a property).
const placesCache = new Map();

export const getNearbyPlaces = (lat, long) => {
  const latitude = Number(lat);
  const longitude = Number(long);
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  if (!placesCache.has(key)) {
    const params = new URLSearchParams({ lat: latitude, lon: longitude });

    const request = apiRequest(`/properties/nearby?${params}`)
      .then((data) => {
        if (data?.unavailable) {
          throw new Error("Nearby places are unavailable right now");
        }
        return data?.places ?? [];
      })
      .catch((error) => {
        // Don't cache failures, so the next visit can try again
        placesCache.delete(key);
        throw error;
      });

    placesCache.set(key, request);
  }

  return placesCache.get(key);
};
