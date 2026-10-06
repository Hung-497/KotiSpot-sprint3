// Fetches points of interest around a location from the public Overpass API.
// Runs on the server so results can be cached and shared by every visitor,
// instead of each browser (and each React StrictMode re-run) querying Overpass.

// Public Overpass servers with worldwide data, tried in order.
// List: https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
const OVERPASS_ENDPOINTS = (
  process.env.OVERPASS_ENDPOINTS ||
  [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  ].join(",")
)
  .split(",")
  .map((endpoint) => endpoint.trim())
  .filter(Boolean);

const REQUEST_TIMEOUT_MS = 15000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // places rarely change
const FAILURE_TTL_MS = 60 * 1000; // don't hammer Overpass while it is down
const MAX_CACHE_ENTRIES = 500;

const cache = new Map(); // key -> { expiresAt, promise }

const buildQuery = (lat, lon) => `
  [out:json][timeout:15];
  (
    node["amenity"~"^(cafe|restaurant|school|hospital|pharmacy)$"](around:700,${lat},${lon});
    node["shop"="supermarket"](around:700,${lat},${lon});
    node["leisure"="park"](around:700,${lat},${lon});
    node["highway"="bus_stop"](around:400,${lat},${lon});
  );
  out;
`;

// Only send the browser what the map uses
const toPlace = (element) => ({
  id: element.id,
  lat: element.lat,
  lon: element.lon,
  tags: {
    name: element.tags?.name,
    amenity: element.tags?.amenity,
    shop: element.tags?.shop,
    leisure: element.tags?.leisure,
    highway: element.tags?.highway,
  },
});

const fetchFromEndpoint = async (endpoint, query) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "KotiSpot/1.0 (student project)",
    },
    body: "data=" + encodeURIComponent(query),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${endpoint} responded with ${response.status}`);
  }

  const data = await response.json();

  // Overpass can answer 200 OK but report a timeout in "remark"
  if (data.remark && /error|timed out/i.test(data.remark)) {
    throw new Error(`${endpoint}: ${data.remark}`);
  }

  return (data.elements ?? []).map(toPlace);
};

const fetchWithFallback = async (query) => {
  const failures = [];

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await fetchFromEndpoint(endpoint, query);
    } catch (error) {
      failures.push(`${endpoint}: ${error.message}`);
    }
  }

  const error = new Error("All Overpass servers failed");
  error.failures = failures;
  throw error;
};

const getNearbyPlaces = (lat, lon) => {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise;
  }

  // Keep memory bounded: drop the oldest entry
  if (cache.size >= MAX_CACHE_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }

  const entry = { expiresAt: Infinity, promise: null };

  entry.promise = fetchWithFallback(buildQuery(lat, lon)).then(
    (places) => {
      entry.expiresAt = Date.now() + CACHE_TTL_MS;
      return places;
    },
    (error) => {
      entry.expiresAt = Date.now() + FAILURE_TTL_MS;
      throw error;
    },
  );

  cache.set(key, entry);
  return entry.promise;
};

const clearNearbyPlacesCache = () => cache.clear();

module.exports = { getNearbyPlaces, clearNearbyPlacesCache };
