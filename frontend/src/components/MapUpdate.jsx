import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Leaflet needs to recalculate its size after entering or leaving fullscreen.
const MapUpdate = ({ fullscreen }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [fullscreen, map]);

  return null;
};

export default MapUpdate;
