import { useEffect } from "react";
import { GameAction } from "../gameTypes";
import { addHandEntry, setCurrentRating } from "../gameReducer";

/**
 * Custom Hook: useHandMovement
 * Handles the movement of hand signs and their progression through the game.
 * 
 * OUTER LOOP: Iterates through the hand entries (song_entries) one by one.
 *  - Sets the current hand sign's symbol and prompt for display.
 *  - Dispatches the hand entry to the game state.
 * 
 * INNER LOOP: Moves the hand sign across the screen until it reaches the goal distance.
 *  - Calculates the hand's X-coordinate based on elapsed time and total duration.
 *  - Evaluates the player's performance (rating) when the hand reaches a specific zone.
 * 
 * ** NOTE: Variables inside useEffect can become stale unless added to the dependency array.
 * ** This hook uses recursion and intervals to manage the hand movement logic.
 * 
 * @param {boolean} isCameraReady - Indicates if the camera is ready to start processing.
 * @param {Array} song_entries - Array of hand sign entries, each containing:
 *   - {string} timestamp: The timestamp of the hand sign.
 *   - {number} duration: The duration of the hand sign in milliseconds.
 *   - {string} prompt: The text prompt for the hand sign.
 *   - {string} asl: The ASL (American Sign Language) symbol for the hand sign.
 * @param {function} dispatch - Dispatch function to update the game state.
 * @param {function} setAreHandsignsDone - State setter to indicate if all hand signs are completed.
 * @param {function} setHandXCoordinate - State setter to update the X-coordinate of the hand's position.
 */
export const useHandMovement = (
  isCameraReady: boolean,
  song_entries:
    | {
        timestamp: string;
        duration: number;
        prompt: string;
        asl: string;
      }[]
    | undefined,
  dispatch: React.ActionDispatch<[action: GameAction]>,
  setAreHandsignsDone: React.Dispatch<React.SetStateAction<boolean>>,
  setHandXCoordinate: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    if (!isCameraReady) return;
    if (!song_entries) return;

    // the innerloop for moving the hands
    let interval: NodeJS.Timeout;

    // Recursion Loop
    const handleHandEntry = (index: number) => {
      // Base case
      if (index >= song_entries.length) {
        setAreHandsignsDone(true);
        return;
      }

      dispatch(
        addHandEntry(song_entries[index].asl, song_entries[index].prompt)
      );

      // get duration in an entry
      const duration = song_entries[index].duration;

      const finalDistance = 600;
      const perfectZoneX = 500;

      const perfectTime = duration - 500;
      const localCurrentHandDuration = perfectTime + 500;

      const startTime = Date.now();

      // hand sign movement logic
      interval = setInterval(() => {
        // get progress and move the hand
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / localCurrentHandDuration, 1);
        const newPosition = progress * finalDistance;

        setHandXCoordinate(newPosition);

        // Evaluate if hand sign is true
        // ...
        // useRef to access
        if (newPosition > 300) {
          dispatch(setCurrentRating(newPosition, perfectZoneX));
        }

        // stop if more than 100% complete
        if (progress >= 1) {
          clearInterval(interval);
          handleHandEntry(index + 1);
          setHandXCoordinate(0);
        }
      }, 16);
    };

    // Start with 0 Index
    handleHandEntry(0);
  }, [dispatch, isCameraReady, setAreHandsignsDone, setHandXCoordinate, song_entries]);
};

