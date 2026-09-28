import { MapContainer, Marker, Popup, TileLayer, ZoomControl, } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useState, useEffect } from "react";
import { Expand, Shrink } from "lucide-react";
import MapUpdate from "./MapUpdate";
import { propertyIcon, icons, getPlaceType, } from "../../mapIcon";
import { getNearbyPlaces,} from "../../POIs";

const PropertyMap = () => {
    const position = [60.179267391512035, 24.92261950818177]; {/* put random lattitude n longtitute in Toolo to test  */}
    const [fullscreen, setFullscreen] = useState(false);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchNearbyPlaces = async () => {
            try {
            const data = await getNearbyPlaces( position[0], position[1]);

        setPlaces(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchNearbyPlaces();
  }, []);

    return (
        <div className={fullscreen ? "fixed inset-0 z-9999 bg-white" : "relative w-full h-100 rounded-xl overflow-hidden"}>

            <MapContainer center={position} zoom={15} scrollWheelZoom={false} zoomControl={false} className="w-full h-full">
                <TileLayer attribution= '&copy; OpenStreetMap contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={position} icon={propertyIcon}> <Popup>Example Street 10, Helsinki</Popup> </Marker>

                {places.map((place) => {
                    const type = getPlaceType(place);
                        return (
                            <Marker key={place.id} position={[
                                place.lat,
                                place.lon,
                            ]}
                            icon={icons[type] || icons.default}
                            >

                            <Popup> <strong> {place.tags?.name || "Nearby place"} </strong> <br/> </Popup>
                            </Marker>
                        );
                        })}

                <ZoomControl position="bottomright" />
                <MapUpdate fullscreen={fullscreen} />
            </MapContainer>

            <button type="button" onClick={() => setFullscreen(!fullscreen)} className="absolute right-4 top-4 z-1000 rounded-lg bg-white px-4 py-2 shadow-md hover:bg-gray-100">
            {fullscreen ? (<Shrink size={20} />) : (<Expand size={20} />)}</button>
        </div>


    );
}

export default PropertyMap;
