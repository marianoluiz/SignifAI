import { useEffect } from "react";
import { reduceDuration } from "../gameReducer";
import { GameAction } from "../gameTypes";
import { NavigateFunction } from "react-router";

/**
 * Function handle game over
 * LOOP: until state.initialSongDuration is 0:
 *  - subtract 1000 to the state.initialSongDuration
 *  - if 0 then end the game
 */
export const useGameTimer = (
  song_duration: number,
  dispatch: React.ActionDispatch<[action: GameAction]>,
  navigate: NavigateFunction
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (song_duration > 0) {
        dispatch(reduceDuration());
      } else {
        // clearInterval(interval);
        // navigate("/result");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [song_duration, dispatch, navigate]);
};
