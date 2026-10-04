import { useLocation, useNavigate } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";

const ComparisonActions = ({ selectedProperties, onClear }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (selectedProperties.length < 2) return null;

  return (
    <div className="sticky bottom-4 z-20 mt-6 flex justify-center">
      <div className="ks-comparison-actions flex flex-wrap justify-center gap-2 rounded-card border border-line bg-surface p-2 shadow-raised">
        <button
          type="button"
          onClick={() => navigate("/comparison", {
            state: { selectedProperties, returnTo: pathname },
          })}
          className="ks-btn ks-btn-primary ks-comparison-primary"
        >
          <GitCompareArrows size={17} strokeWidth={2} aria-hidden="true" />
          Compare {selectedProperties.length} properties
        </button>
        <button type="button" onClick={onClear} className="ks-btn ks-btn-ghost ks-comparison-clear">
          Clear selection
        </button>
      </div>
    </div>
  );
};

export default ComparisonActions;
