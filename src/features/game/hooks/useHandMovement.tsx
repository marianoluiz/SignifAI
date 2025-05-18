import { useEffect } from "react";
import { GameAction } from "../gameTypes";
import { addHandEntry, addScore, setCurrentRating } from "../gameReducer";

import { resultLandmarks } from "../../../utils/handLandmarkerHelper"
import { getPrediction  } from "../../../utils/modelHelper";

import checkSign from "../utils/checkSign"
import { calculateRating } from "../utils/calculateRating";

/**
 * Custom Hook: useHandMovement
 * 
 * Handles the movement of hand signs and their progression through the game.
 * This hook manages the logic for displaying hand signs, moving them across the screen,
 * and evaluating the player's performance based on their gestures.
 * 
 * **Logic Overview**:
 * - **Outer Loop**: Iterates through the hand entries (`song_entries`) one by one.
 *   - Sets the current hand sign's symbol, lyrics, and prompt for display.
 *   - Dispatches the hand entry to the game state.
 * - **Inner Loop**: Moves the hand sign across the screen until it reaches the goal distance.
 *   - Calculates the hand's X-coordinate based on elapsed time and total duration.
 *   - Evaluates the player's performance (rating) when the hand reaches a specific zone.
 *   - Dispatches the rating and score to the game state.
 * 
 * **Key Features**:
 * - Uses recursion and intervals to manage the hand movement logic.
 * - Evaluates gestures using a prediction model and checks if the gesture matches the expected ASL symbol.
 * - Calculates the player's rating (e.g., "PERFECT", "GOOD", "OK", "MISS") based on timing and accuracy.
 * - Updates the game state with the player's score and rating.
 * - Handles edge cases such as missed gestures or incorrect gestures.
 * 
 * **Rating Outcomes**:
 * If gesture judged correct and timed on RED BAR inside rating zone, then MISS rating.
 * If gesture judged wrong, nothing happens.
 * If gesture judged correct and avoided the RED BAR inside rating zone, then [PERFECT/GOOD/OK] rating.
 * If hand reached end without gesture being judged, then MISS rating
 * 
 * **Important Notes**:
 * - Variables inside `useEffect` can become stale unless added to the dependency array.
 * - The hook ensures smooth hand movement by updating the X-coordinate at 16ms intervals (~60 FPS).
 * 
 * @param {boolean} isCameraReady - Indicates if the camera is ready to start processing.
 * @param {Array} song_entries - Array of hand sign entries, each containing:
 *   - {string} timestamp: The timestamp of the hand sign.
 *   - {number} duration: The duration of the hand sign in milliseconds.
 *   - {string} lyric: The lyrics associated with the hand sign.
 *   - {string} prompt: The text prompt for the hand sign.
 *   - {string} asl: The ASL (American Sign Language) symbol for the hand sign.
 * @param {function} dispatch - Dispatch function to update the game state.
 * @param {function} setAreHandsignsDone - State setter to indicate if all hand signs are completed.
 * @param {function} setHandXCoordinate - State setter to update the X-coordinate of the hand's position.
 * 
 * @example
 * ```tsx
 * useHandMovement(
 *   isCameraReady,
 *   song_entries,
 *   dispatch,
 *   setAreHandsignsDone,
 *   setHandXCoordinate
 * );
 * ```
 */
export const useHandMovement = (
  isCameraReady: boolean,
  song_entries:
    | {
        timestamp: string;
        duration: number;
        lyric: string;
        prompt: string;
        asl: string;
      }[]
    | undefined,
  dispatch: React.ActionDispatch<[action: GameAction]>,
  setAreHandsignsDone: React.Dispatch<React.SetStateAction<boolean>>,
  setHandXCoordinate: React.Dispatch<React.SetStateAction<number>>,
  deviceType: string
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
        addHandEntry(
          song_entries[index].asl,
          song_entries[index].lyric,
          song_entries[index].prompt
        )
      );

      // get duration in an entry
      const duration = song_entries[index].duration;

      // ======TESTING PURPOSE======
      // deviceType = "mobile"

      // default for pc
      let perfectZoneX = 600;
      let rateZone = 200;

      if ( deviceType === "mobile" ) {
        perfectZoneX = 200;
        rateZone = 20;
      } else if (deviceType === "tablet" ) {
        perfectZoneX = 400;
        rateZone = 100;
      }

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

        // If it isnt flagged judged and it is in rate zone then get and dispatch rating
        if (!gestureJudged && newPosition > rateZone) {
          // Evaluate using the model
          const predictedStr = await getPrediction(resultLandmarks);
          // console.log('predicted string: ', predictedStr);

          // use a helper to check if it MATCH the current ASL symbol moving in the UI
          if (predictedStr !== "No prediction") {
            const gestureStatus = checkSign(
              predictedStr,
              song_entries[index].asl
            );

            // if gesture is correct, flag as correct then calculate rating then score
            if (gestureStatus === true) {
              gestureJudged = true;

              // rating directly without getting from the reducer which causes stale variables
              const currentRating = calculateRating(
                newPosition,
                perfectZoneX,
                deviceType ?? "pc"
              );
              // dispatch the rating along with timestamp to re-render 100%
              dispatch(setCurrentRating(newPosition, perfectZoneX, Date.now()));

              if (currentRating !== "MISS")
                console.log("Gesture is correct at : ", newPosition);
              else console.log("Gesture is correct but Missed timing");

              // useReducer function to calculate score,
              dispatch(addScore(currentRating, "No Difficulty Mode"));
            } else if (gestureStatus === false) {
              gestureJudged = true;
              // MISS, pass 0 xCoordinate
              // the Date.now() is the timestamp used to re-render the state even
              // if the xCoordinate is change used in game.tsx passed through useShowRating hook.
              dispatch(setCurrentRating(0, perfectZoneX, Date.now()));
              console.log("Gesture is incorrect");
            }
          }
        }

        // If the hand sign reached 100% of its destination,
        if (progress >= 1) {
          /* If 1 hand sign done and not judged, pass 0 as coordinate for it to be MISS rating */
          if (gestureJudged === false) {
            // MISS, pass 0 xCoordinate to be rated wrong
            dispatch(setCurrentRating(0, perfectZoneX, Date.now()));
            console.log("Gesture Missed!");
          }

          /* After 1 hand sign done, reset the judge flag and move to next hand then reset the coordinate */
          gestureJudged = false;
          clearInterval(interval);
          handleHandEntry(index + 1);
          setHandXCoordinate(0);
        }
      }, 16); // 16ms
    };

    // Start with 0 Index
    handleHandEntry(0);
  }, [deviceType, dispatch, isCameraReady, setAreHandsignsDone, setHandXCoordinate, song_entries]);
};

