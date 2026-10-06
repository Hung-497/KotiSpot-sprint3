import { Star, Heart } from "lucide-react";
import SegmentedControl from "./SegmentedControl";

const tabs = [
  { value: "recommendations", label: "Recommended", Icon: Star, fillWhenActive: true },
  { value: "favorites", label: "Favourites", Icon: Heart, fillWhenActive: true },
];

// Presentational Recommended / Favourites switch shared by the browsing pages
const PropertyTabs = ({ activeTab, onChange }) => (
  <SegmentedControl options={tabs} value={activeTab} onChange={onChange} />
);

export default PropertyTabs;
