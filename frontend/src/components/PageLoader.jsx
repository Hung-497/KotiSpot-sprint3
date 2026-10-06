// Shown while a page fetches its data or while something saves. Appears
// after a short delay so fast loads don't flash, and announces itself to
// screen readers.
// `fullPage` centres a larger loader in the space between navbar and footer.
// `variant` is "bar" (page loads) or "spinner" (saving).
const PageLoader = ({
  label = "Loading…",
  fullPage = false,
  variant = "bar",
  className = "",
  textClassName = "",
}) => (
  <div
    role="status"
    aria-live="polite"
    className={`ks-loader ${fullPage ? "ks-loader-page" : ""} ${className}`}
  >
    <span
      className={variant === "spinner" ? "ks-spinner" : "ks-loader-bar"}
      aria-hidden="true"
    />
    <span
      className={`${fullPage ? "text-lg font-medium text-ink" : "text-sm text-ink-muted"} ${textClassName}`}
    >
      {label}
    </span>
  </div>
);

export default PageLoader;
