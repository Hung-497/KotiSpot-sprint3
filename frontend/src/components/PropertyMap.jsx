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

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const data = await getNearbyPlaces(latitude, longitude);
        setPlaces(data);
      } catch (error) {
        console.error("Error loading nearby places:", error);
      }
    };

    fetchNearbyPlaces();
  }, [latitude, longitude]);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-9999 bg-white"
          : "relative w-full h-100 rounded-xl overflow-hidden"
      }
    >
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
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

      <button
        type="button"
        onClick={() => setFullscreen(!fullscreen)}
        className="absolute right-4 top-4 z-1000 rounded-lg bg-white px-4 py-2 shadow-md hover:bg-gray-100"
      >
        {fullscreen ? <Shrink size={20} /> : <Expand size={20} />}
      </button>
    </div>
  );
};

export default PropertyMap;
