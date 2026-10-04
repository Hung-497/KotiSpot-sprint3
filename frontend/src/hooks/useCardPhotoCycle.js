import { useEffect, useRef, useState } from "react";

const FIRST_ADVANCE_DELAY = 600;
const ADVANCE_INTERVAL = 1600;

// While a mouse hovers the card, slides to the next photo every
// ADVANCE_INTERVAL ms; leaving the card returns to the main photo.
const useCardPhotoCycle = (photoCount) => {
  const [index, setIndex] = useState(0);
  const [hasHovered, setHasHovered] = useState(false);
  const timers = useRef({ delay: null, interval: null });

  const clearTimers = () => {
    clearTimeout(timers.current.delay);
    clearInterval(timers.current.interval);
  };

  useEffect(() => clearTimers, []);

  const start = (event) => {
    if (
      event.pointerType !== "mouse" ||
      photoCount < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Load the other photos only once someone shows interest
    setHasHovered(true);
    clearTimers();

    const advance = () => setIndex((current) => (current + 1) % photoCount);

    timers.current.delay = setTimeout(() => {
      advance();
      timers.current.interval = setInterval(advance, ADVANCE_INTERVAL);
    }, FIRST_ADVANCE_DELAY);
  };

  const stop = () => {
    clearTimers();
    setIndex(0);
  };

  return { index, hasHovered, start, stop };
};

export default useCardPhotoCycle;
