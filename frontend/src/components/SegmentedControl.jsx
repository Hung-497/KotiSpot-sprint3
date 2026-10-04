import { useLayoutEffect, useRef } from "react";

// A row of mutually exclusive buttons with one pine indicator that slides
// behind the active option. `transitionName` lets the indicator keep
// sliding during a page view transition (used by the theme picker).
const SegmentedControl = ({
  options,
  value,
  onChange,
  disabled = false,
  transitionName,
  className = "",
}) => {
  const buttonRefs = useRef({});
  const indicatorRef = useRef(null);
  const hasPositioned = useRef(false);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const button = buttonRefs.current[value];

    if (!indicator || !button) {
      return undefined;
    }

    const place = () => {
      indicator.style.width = `${button.offsetWidth}px`;
      indicator.style.transform = `translateX(${button.offsetLeft}px)`;
    };

    // First placement happens without animating from the left edge
    if (!hasPositioned.current) {
      indicator.style.transition = "none";
      place();
      indicator.getBoundingClientRect();
      indicator.style.transition = "";
      hasPositioned.current = true;
    } else {
      place();
    }

    // Button widths change when the web font finishes loading
    const observer = new ResizeObserver(place);
    observer.observe(button);

    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      className={`relative inline-flex rounded-control border border-line bg-surface p-1 ${className}`}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        style={transitionName ? { viewTransitionName: transitionName } : undefined}
        className="ks-segment-indicator absolute left-0 top-1 bottom-1 rounded-md bg-pine-700"
      />

      {options.map(({ value: optionValue, label, Icon, fillWhenActive }) => {
        const isActive = value === optionValue;

        return (
          <button
            key={optionValue}
            ref={(element) => {
              buttonRefs.current[optionValue] = element;
            }}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(optionValue)}
            className={`relative z-10 flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-220 active:scale-[0.97] ${
              isActive ? "text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            {Icon && (
              <Icon
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                fill={isActive && fillWhenActive ? "currentColor" : "none"}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
