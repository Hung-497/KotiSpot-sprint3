// Faint lake-map contour lines used as a background texture in a few
// pine areas (Home hero, log in panel, footer). Purely decorative.
const buildRings = (cx, cy, rings, seed) =>
  Array.from({ length: rings }, (_, ringIndex) => {
    const ring = ringIndex + 1;
    const radius = ring * 26;
    const points = Array.from({ length: 65 }, (_, step) => {
      const angle = (step / 64) * Math.PI * 2;
      const wobble =
        1 +
        0.18 * Math.sin(3 * angle + ring * 0.7 + seed) +
        0.1 * Math.sin(5 * angle + ring + seed * 2);
      const x = cx + Math.cos(angle) * radius * 1.6 * wobble;
      const y = cy + Math.sin(angle) * radius * wobble;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      d: `M${points.join(" L")} Z`,
      // Outer rings fade out so the pattern has no hard edge
      opacity: Math.max(0.25, 1 - ringIndex * 0.08),
    };
  });

// Two "lakes" per pattern, computed once
const patterns = {
  right: [...buildRings(470, 230, 10, 0), ...buildRings(80, 40, 6, 1.3)],
  left: [...buildRings(110, 330, 10, 0.6), ...buildRings(540, 50, 6, 2.1)],
};

const Contours = ({ variant = "right", className = "" }) => (
  <svg
    viewBox="0 0 600 400"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
  >
    {patterns[variant].map((ring, index) => (
      <path key={index} d={ring.d} strokeOpacity={ring.opacity} />
    ))}
  </svg>
);

export default Contours;
