let activeTransition = null;
let activeTarget = null;
let changeVersion = 0;
let cleanupTimer;

export const applyThemeClass = (useDark, { animate = true } = {}) => {
  const root = document.documentElement;
  // Confirming the same preference must not interrupt an ongoing fade.
  if (activeTransition && activeTarget === useDark) return;
  if (!activeTransition && root.classList.contains("dark") === useDark) return;
  const version = ++changeVersion;

  activeTransition?.skipTransition();
  activeTransition = null;
  activeTarget = null;
  clearTimeout(cleanupTimer);
  root.classList.remove("theme-switching", "theme-fading", "theme-transition");

  if (root.classList.contains("dark") === useDark) {
    return;
  }

  const swap = () => {
    // A failed save or a new system theme can supersede a pending fade.
    if (version !== changeVersion) return;
    root.classList.add("theme-switching");
    root.classList.toggle("dark", useDark);
    // Force the new colours to apply before transitions come back
    window.getComputedStyle(root).color;
    if (!root.classList.contains("theme-transition")) {
      cleanupTimer = setTimeout(() => root.classList.remove("theme-switching"), 0);
    }
  };

  const canCrossFade =
    animate &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canCrossFade) {
    try {
      root.classList.add("theme-transition");
      const transition = document.startViewTransition(swap);
      activeTransition = transition;
      activeTarget = useDark;
      transition.finished.catch(() => {}).finally(() => {
        if (activeTransition === transition) {
          activeTransition = null;
          activeTarget = null;
        }
        if (version === changeVersion) root.classList.remove("theme-transition", "theme-switching");
      });
    } catch {
      root.classList.remove("theme-transition");
      swap();
    }
  } else if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Colour interpolation provides a smooth fallback without snapshots.
    root.classList.add("theme-fading");
    root.classList.toggle("dark", useDark);
    cleanupTimer = setTimeout(() => root.classList.remove("theme-fading"), 400);
  } else {
    swap();
  }
};
