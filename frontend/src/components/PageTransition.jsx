import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCrossFadePath,
  navigateWithCrossFade,
  notifyRouteCommitted,
} from "../utils/routeTransition";

// Wraps the page content between the navbar and footer.
// - Internal link clicks cross-fade from the old page to the new one.
// - Each new page opens scrolled to the top.
// - Navigations without a cross-fade (redirects, form submits, older
//   browsers) get a light fade instead.
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const isFirstRender = useRef(true);

  // Capture phase runs before React Router's own Link handler, so
  // preventing the default here hands the navigation to the cross-fade.
  useEffect(() => {
    const handleClick = (event) => {
      const path = getCrossFadePath(event);

      if (!path) {
        return;
      }

      event.preventDefault();
      navigateWithCrossFade(navigate, path);
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [navigate]);

  // Layout effect: runs inside the navigation itself, so the scroll reset
  // happens before the new page is captured and the cross-fade flags are
  // still set when we decide whether to fade
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo(0, 0);
    // The new page is in the DOM: let a running cross-fade capture it
    notifyRouteCommitted();

    const root = document.documentElement;
    const skipFade =
      root.dataset.routeTransition ||
      root.dataset.photoTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!skipFade) {
      // Starts from 0.6 rather than 0, so there's never a blank frame
      contentRef.current?.animate([{ opacity: 0.6 }, { opacity: 1 }], {
        duration: 180,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      });
    }
  }, [pathname]);

  return (
    <div ref={contentRef} className="flex grow flex-col">
      {children}
    </div>
  );
};

export default PageTransition;
