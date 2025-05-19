import { useEffect } from "react";
import { reduceDuration } from "../gameReducer";
import { GameAction, GameState } from "../gameTypes";
import { NavigateFunction } from "react-router";

/**
 * Function handle game over
 * LOOP: until state.initialSongDuration is 0:
 *  - subtract 1000 to the state.initialSongDuration
 *  - if 0 then end the game
 * 
 * @param song_duration - fetched from json how long the song is
 * @param dispatch - the dispatch object to access reducer states
 * @param navigate - to move to result page
 */
export const useGameTimer = (
  song_duration: number,
  dispatch: React.ActionDispatch<[action: GameAction]>,
  navigate: NavigateFunction,
  state: GameState,
  song_title: string
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (song_duration > 0) {
        dispatch(reduceDuration());
      } else if (song_duration <= 0) {
        navigate("/play/result", {
          state: { score: state.score, song_title: song_title },
        });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [song_duration, dispatch, navigate, state.score, song_title]);
};
