import L from "leaflet";

const createCircleIcon = (emoji, bgColor) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${bgColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

export const propertyIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1f1f1f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 2px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
    ">
      🏠
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

export const icons = {
  park: createCircleIcon("🌳", "#65a30d"),
  bus_stop: createCircleIcon("🚌", "#f59e0b"),
  cafe: createCircleIcon("☕", "#a16207"),
  restaurant: createCircleIcon("🍴", "#ef4444"),
  school: createCircleIcon("🏫", "#3b82f6"),
  hospital: createCircleIcon("🏥", "#dc2626"),
  pharmacy: createCircleIcon("💊", "#10b981"),
  supermarket: createCircleIcon("🛒", "#8b5cf6"),
  default: createCircleIcon("📍", "#6b7280"),
};

export const getPlaceType = (place) => {
  if (place.tags?.highway === "bus_stop") return "bus_stop";
  if (place.tags?.leisure === "park") return "park";
  if (place.tags?.amenity) return place.tags.amenity;
  if (place.tags?.shop) return place.tags.shop;

  return "default";
};