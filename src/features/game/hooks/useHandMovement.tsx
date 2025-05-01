import { useEffect } from "react";
import { GameAction } from "../gameTypes";
import { addHandEntry, addScore, setCurrentRating } from "../gameReducer";

import { resultLandmarks } from "../../../utils/handLandmarkerHelper"
import { getPrediction  } from "../../../utils/modelHelper";

import checkSign from "../helpers/checkSign"
import { calculateRating } from "../helpers/calculateRating";

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

      const perfectZoneX = 600;
      const rateZone = 200;
      const perfectTime = duration;

      const startTime = Date.now();
      let gestureJudged = false; // mark if sign is judged

      // hand sign movement logic loop
      interval = setInterval(async () => {
        // get progress and move the hand
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / perfectTime, 1);
        const newPosition = progress * perfectZoneX;

        setHandXCoordinate(newPosition);


        // useRef to access
        if (!gestureJudged && newPosition > rateZone) {
          // Evaluate
          const predictedStr = await getPrediction(resultLandmarks);
          // console.log('predicted string: ', predictedStr);

          if (predictedStr !== "No prediction") {
            const gestureStatus = checkSign(
              predictedStr,
              song_entries[index].asl
            );

            if (gestureStatus === true) {
              gestureJudged = true;
              const currentRating = calculateRating(newPosition, perfectZoneX);
              dispatch(setCurrentRating(newPosition, perfectZoneX));

              if (currentRating !== "MISS") console.log("Gesture is correct at : ", newPosition);
              else console.log("Gesture is correct but Missed timing");

              dispatch(addScore(currentRating, "No Difficulty Mode"));
            } else if (gestureStatus === false) {
              gestureJudged = true;
              // MISS, pass 0 xCoordinate
              dispatch(setCurrentRating(0, perfectZoneX));
              console.log("Gesture is incorrect");
            }
          }
        }

        // move to next if more than 100% complete
        if (progress >= 1) {
          if(gestureJudged === false) {
            // MISS, pass 0 xCoordinate
            dispatch(setCurrentRating(0, perfectZoneX));
            console.log("Gesture Missed!");
          }

          gestureJudged = false;
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

