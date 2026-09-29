import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapUpdate = ({ fullscreen }) => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [fullscreen, map]);

    return null;
};

export default MapUpdate;