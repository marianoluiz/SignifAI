import { useEffect } from "react";
import { GameAction } from "../gameTypes";
import { setGame } from "../gameReducer";

/**
 * Custom hook to set up the game when the camera is ready.
 * 
 * - Plays the audio when the camera is ready.
 * - Dispatches an action to set the game state with the song duration.
 * - Cleans up by stopping the audio when the component unmounts or dependencies change.
 * - do not put song as dependency or website would crash
 * 
 * @param isCameraReady - Flag indicating if the camera is ready to start.
 * @param song - Object containing audio control methods (play, stop, pause) and the audio reference.
 * @param dispatch - Dispatch function to trigger Redux actions.
 * @param wholeSongDuration - Duration of the entire song to be used in the game.
 */
export const useGameSetup = (
  isCameraReady: boolean,
  song: {
    playAudio: () => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
  },
  dispatch: React.ActionDispatch<[action: GameAction]>,
  wholeSongDuration: number
) => {
  useEffect(() => {
    if (!isCameraReady) return;
    song.playAudio();
    dispatch(setGame(wholeSongDuration ?? 0));

    // cleanup function
    return () => {
      song.stopAudio();
    };
  }, [dispatch, isCameraReady, wholeSongDuration]);
};