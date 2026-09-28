export const getNearbyPlaces = async (lat, long) => {
  const query = `
    [out:json];

    (
      node["amenity"="cafe"](around:1000,${lat},${long});
      node["amenity"="restaurant"](around:1000,${lat},${long});
      node["amenity"="school"](around:1000,${lat},${long});
      node["amenity"="hospital"](around:1000,${lat},${long});
      node["amenity"="pharmacy"](around:1000,${lat},${long});

      node["shop"="supermarket"](around:1000,${lat},${long});

      node["leisure"="park"](around:1000,${lat},${long});

      node["highway"="bus_stop"](around:1000,${lat},${long});
    );

    out;
  `;

  const url ="https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch nearby places");
  }

  const data = await response.json();

  return data.elements;
};