import { useEffect, useState } from "react";

// How long account pages keep their loading screen up, even when the
// data arrives sooner. One value so every page feels the same.
export const PAGE_LOADING_MS = 2500;

// Returns false until `ms` milliseconds have passed since the component
// mounted. Used to keep a page's loading screen up for a minimum time.
const useMinimumDuration = (ms) => {
  const [hasElapsed, setHasElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasElapsed(true), ms);

    return () => clearTimeout(timer);
  }, [ms]);

  return hasElapsed;
};

export default useMinimumDuration;
