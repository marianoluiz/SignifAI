import { useState, useEffect } from "react";

/**
 * Custom hook to manage the visibility of the rating effect.
 *
 * @param currentRating - The player's current rating (e.g., "PERFECT", "GOOD", "OK", "MISS").
 * @param timestamp - The timestamp when the rating was calculated.
 * @returns A boolean state indicating whether the rating effect should be shown.
 */
const useShowRating = (currentRating: string, timestamp: number) => {
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (currentRating) {
      setShowRating(true);

      const timeout = setTimeout(() => {
        setShowRating(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentRating, timestamp]);

  return [showRating, setShowRating] as const; // Return both state and setter
};

export default useShowRating;