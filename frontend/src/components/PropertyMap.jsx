import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useState, useEffect } from "react";
import { Expand, Shrink } from "lucide-react";

function MapUpdate ({fullscreen}) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => { map.invalidateSize();
         }, 100);

        return () => clearTimeout(timer);
    }, [fullscreen, map]);

    return null;
}

const PropertyMap = () => {
    const position = [60.179267391512035, 24.92261950818177]; {/* put random lattitude n longtitute in Toolo to test  */}
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <div className={fullscreen ? "fixed inset-0 z-9999 bg-white" : "relative w-full h-100 rounded-xl overflow-hidden"}>

            <MapContainer center={position} zoom={15} scrollWheelZoom={false} zoomControl={false} className="w-full h-full">
                <TileLayer attribution= '&copy; OpenStreetMap contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={position}> <Popup>Example Street 10, Helsinki</Popup> </Marker>
                <ZoomControl position="bottomright" />
                <MapUpdate fullscreen={fullscreen} />
            </MapContainer>

            <button type="button" onClick={() => setFullscreen(!fullscreen)} className="absolute right-4 top-4 z-1000 rounded-lg bg-white px-4 py-2 shadow-md hover:bg-gray-100">
            {fullscreen ? (<Shrink size={20} />) : (<Expand size={20} />)}</button>
        </div>


    );
}

export default PropertyMap;
