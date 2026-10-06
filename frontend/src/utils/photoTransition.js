import { flushSync } from "react-dom";

// Name shared by the clicked card photo and the detail page's main photo,
// so the browser can morph one into the other.
export const PHOTO_TRANSITION_NAME = "property-photo";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Resolves once the detail page's main photo is in the DOM and decoded,
// or after `timeout` ms so a slow request never freezes the page for long.
const waitForDetailPhoto = (timeout) =>
  new Promise((resolve) => {
    const started = performance.now();

    const check = () => {
      const photo = Array.from(document.querySelectorAll("[data-photo-transition-target]"))
        .find((image) => image.getClientRects().length > 0);

      if (photo) {
        Promise.race([
          photo.decode().catch(() => {}),
          new Promise((done) => setTimeout(done, timeout)),
        ]).finally(resolve);
      } else if (performance.now() - started > timeout) {
        resolve();
      } else {
        // setTimeout rather than requestAnimationFrame, which never fires
        // in background tabs and would leave this waiting forever
        setTimeout(check, 16);
      }
    };

    check();
  });

// Navigates to a property detail page, morphing the card photo into the
// gallery photo where the View Transitions API is available. Everywhere
// else (or with reduced motion) it is a normal navigation.
export const navigateWithPhotoTransition = (navigate, to, photoElement) => {
  if (
    typeof document.startViewTransition !== "function" ||
    prefersReducedMotion() ||
    !photoElement
  ) {
    navigate(to);
    return;
  }

  const root = document.documentElement;
  photoElement.style.viewTransitionName = PHOTO_TRANSITION_NAME;
  // Tells PageTransition to skip its fade; the view transition handles it
  root.dataset.photoTransition = "true";

  const transition = document.startViewTransition(async () => {
    photoElement.style.viewTransitionName = "";
    flushSync(() => navigate(to));
    await waitForDetailPhoto(500);
  });

  transition.finished.finally(() => {
    delete root.dataset.photoTransition;
  });
};
