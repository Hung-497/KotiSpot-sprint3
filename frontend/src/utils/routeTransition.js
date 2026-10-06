// React Router may apply a navigation slightly later than the click, so
// the cross-fade waits for PageTransition to report the new page instead
// of assuming the DOM changed straight away.
let resolvePendingRoute = null;

export const notifyRouteCommitted = () => {
  resolvePendingRoute?.();
  resolvePendingRoute = null;
};

const MAX_ROUTE_WAIT_MS = 400;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Navigates inside the app with a cross-fade from the old page to the new
// one (no blank frame). Falls back to a normal navigation where the View
// Transitions API is missing or motion is reduced.
export const navigateWithCrossFade = (navigate, to) => {
  if (
    typeof document.startViewTransition !== "function" ||
    prefersReducedMotion()
  ) {
    navigate(to);
    return;
  }

  const root = document.documentElement;
  // Tells PageTransition to skip its fallback fade
  root.dataset.routeTransition = "true";

  const transition = document.startViewTransition(
    () =>
      new Promise((resolve) => {
        resolvePendingRoute = resolve;
        navigate(to);
        // Never hold the old page on screen for long
        setTimeout(notifyRouteCommitted, MAX_ROUTE_WAIT_MS);
      }),
  );

  transition.finished.finally(() => {
    delete root.dataset.routeTransition;
  });
};

// Returns the in-app path for a plain left click on an internal link,
// or null when the browser should handle the click itself.
export const getCrossFadePath = (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const link = event.target.closest?.("a[href]");

  if (
    !link ||
    link.target ||
    link.hasAttribute("download") ||
    link.hasAttribute("data-no-route-transition")
  ) {
    return null;
  }

  const url = new URL(link.href, window.location.href);

  // Same-page anchors (e.g. placeholder "#" links) keep their default
  if (
    url.origin !== window.location.origin ||
    (url.pathname === window.location.pathname && url.hash)
  ) {
    return null;
  }

  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
};
