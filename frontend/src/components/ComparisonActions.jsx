import { useLocation, useNavigate } from "react-router-dom";
import { GitCompareArrows, Info } from "lucide-react";

export const MAX_COMPARISON_PROPERTIES = 6;

const ComparisonActions = ({ selectedProperties, onClear }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (selectedProperties.length < 2) return null;

  return (
    <div className="sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 mt-6 flex justify-center">
      <div className="ks-comparison-actions w-full max-w-md rounded-card border border-line bg-surface p-3 shadow-raised">
        <p className="flex items-center justify-center gap-2 border-b border-line px-1 pb-2 text-center text-xs leading-5 text-ink-muted">
          <Info size={14} className="shrink-0" aria-hidden="true" />
          <span>Select up to {MAX_COMPARISON_PROPERTIES} properties to compare.</span>
        </p>
        <div className="mt-2 grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={() => {
              if (selectedProperties.length > MAX_COMPARISON_PROPERTIES) {
                window.alert(`You can compare up to ${MAX_COMPARISON_PROPERTIES} properties. Deselect a property before comparing.`);
                return;
              }

              navigate("/comparison", {
                state: { selectedProperties, returnTo: pathname },
              });
            }}
            className="ks-btn ks-btn-primary ks-comparison-primary min-h-11"
          >
            <GitCompareArrows size={17} strokeWidth={2} aria-hidden="true" />
            Compare {selectedProperties.length} properties
          </button>
          <button type="button" onClick={onClear} className="ks-btn ks-btn-ghost ks-comparison-clear min-h-11">
            Clear selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonActions;
