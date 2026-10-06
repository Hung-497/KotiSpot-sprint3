import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Expand, Shrink } from "lucide-react";
import MapUpdate from "./MapUpdate";
import { propertyIcon, icons, getPlaceType } from "../../mapIcon";
import { getNearbyPlaces } from "../../POIs";

const PropertyMap = ({ latitude, longitude, address }) => {
  const position = [latitude, longitude];
  const [fullscreen, setFullscreen] = useState(false);
  const [places, setPlaces] = useState([]);
  const [placesUnavailable, setPlacesUnavailable] = useState(false);

  useEffect(() => {
    let ignore = false;

    getNearbyPlaces(latitude, longitude)
      .then((data) => {
        if (ignore) return;
        setPlaces(data);
        setPlacesUnavailable(false);
      })
      .catch((error) => {
        if (ignore) return;
        console.warn("Nearby places unavailable:", error);
        setPlaces([]);
        setPlacesUnavailable(true);
      });

    // Ignore results that arrive after the property changed or the map unmounted
    return () => {
      ignore = true;
    };
  }, [latitude, longitude]);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-9999 bg-white"
          : "relative h-72 w-full sm:h-100 rounded-xl overflow-hidden"
      }
    >
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={propertyIcon}>
          {" "}
          <Popup>{address}</Popup>{" "}
        </Marker>

        {places.map((place) => {
          const type = getPlaceType(place);
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={icons[type] || icons.default}
            >
              <Popup>
                {" "}
                <strong> {place.tags?.name || "Nearby place"} </strong>{" "}
                <br />{" "}
              </Popup>
            </Marker>
          );
        })}

        <ZoomControl position="bottomright" />
        <MapUpdate fullscreen={fullscreen} />
      </MapContainer>

      {placesUnavailable && (
        <p
          role="status"
          className="absolute left-4 top-4 z-1000 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink-muted shadow-md"
        >
          Nearby places couldn't be loaded right now.
        </p>
      )}

      <button
        type="button"
        aria-label={fullscreen ? "Exit fullscreen map" : "View fullscreen map"}
        aria-pressed={fullscreen}
        onClick={() => setFullscreen(!fullscreen)}
        className="absolute right-4 top-4 z-1000 rounded-lg border border-line-strong bg-surface px-4 py-2 text-ink shadow-md transition-colors hover:bg-surface-muted"
      >
        {fullscreen ? <Shrink size={20} aria-hidden="true" /> : <Expand size={20} aria-hidden="true" />}
      </button>
    </div>
  );
};

export default PropertyMap;
