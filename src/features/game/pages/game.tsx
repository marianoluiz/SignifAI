import { useEffect, useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router";

import { IMAGES } from "../../../constants/images"
import { AUDIO } from "../../../constants/audio";
import { SplashScreenAnimation } from "../../../components/SplashScreenAnimation";
import songs_config from "../../../config/songs_config.json";
import { gameReducer } from "../gameReducer";
import { setGame, addScore, addHandEntry } from "../gameReducer";
import useAudio from "../../../hooks/useAudio";

import { formatTime } from "../../../utils/timeHelpers"
import { useCamera } from "../../../globals/camera/cameraContext";
import { useCameraSetup } from "../hooks/useCameraSetup";
import { useGameTimer } from "../hooks/useGameTimer";

const GamePage = () => {
  const navigate = useNavigate();

  // song id
  const { song_var } = useParams();
  // fetch right song
  const song_details = songs_config.songs.find(
    (song) => song.var_name === song_var
  );
  // play song
  const song = useAudio(AUDIO[song_var as keyof typeof AUDIO]);

  // duration of whole song
  const initialSongDuration = song_details?.song_duration ?? 0;
  const song_entries = song_details?.entries;

  // x-coordinate of the hand sign
  const [handXCoordinate, setHandXCoordinate] = useState(0);
  const goalDistance = 600;

  // states with initial state
  const [state, dispatch] = useReducer(gameReducer, {
    song_duration: 0,
    score: 0,
    currentHandDuration: 0,
    currentSymbol: "bg_glitch1" as keyof typeof IMAGES,
    currentPrompt: "No Val",
  });

  // camera status
  const { isCameraReady, setIsCameraReady, canvasRef, videoRef } = useCamera();

  /**
   * Function set the game
   * - plays the audio
   * - sets the reducer state initialSongDuration for game length
   * - when unmount... stop the audio
   */
  useEffect(() => {
    if (!isCameraReady) return;
    song.playAudio();
    dispatch(setGame(initialSongDuration ?? 0));

    // cleanup function
    return () => {
      song.stopAudio();
    };
  }, [isCameraReady, initialSongDuration]);

  /**
   * Function draw and set camera Ready
   * - Setup landmarks and  start camera
   * - sets the global state isCameraReady to True
   * - sets the global state isCameraReady to False after unmount
   */
  useCameraSetup(videoRef, canvasRef, setIsCameraReady);

  /**
   * Function handle game over
   * LOOP: until state.initialSongDuration is 0:
   *  - subtract 1000 to the state.initialSongDuration
   *  - if 0 then end the game
   */
  useGameTimer(state.song_duration, dispatch, navigate);
  
  /**
   * Function handles hand xCoordinate and entries
   * OUTER LOOP: until hand_count is equal to handEntryCount:
   *  - iterate hand counts
   *  - set state.currentSymbol for text and image use
   *  - set state.currentPrompt for text use
   *
   *    INNER LOOP: until goalDistance is reached
   *      - subtract the handXCoordinate
   * 
   * ** NOTE: in useEffect, any variables are stale unless you
   * ** put it in the dependency array which is not ideal for this
   * ** loop... I debugged this for like 6 hours and a normal function
   * ** could have saved my life.
   */
  useEffect(() => {
    if (!isCameraReady) return;
    if (!song_entries) return;

    // the innerloop for moving the hands
    let interval: NodeJS.Timeout;

    // Recursion Loop
    const handleHandEntry = (index: number) => {
      // Base case: If we've reached the end of the song entries, stop
      if (index >= song_entries.length) return;

      console.log(`\nProcessing hand entry: ${index}`);
      dispatch(
        addHandEntry(
          song_entries[index].duration,
          song_entries[index].asl,
          song_entries[index].prompt
        )
      );

      const localCurrentHandDuration = song_entries[index].duration;;

      const startTime = Date.now();

      // hand sign movement logic
      interval = setInterval(() => {
        // get elapsed time
        const elapsedTime = Date.now() - startTime;

        console.log(
          "currentHandDuration of main useeeffect ",
          state.currentHandDuration
        );

        // get progress (percentage)
        const progressDecimal = elapsedTime / localCurrentHandDuration;
        // min to make sure its either 0.xx or 1
        const progress = Math.min(progressDecimal, 1);

        // stop if more than 100% complete
        if (progress >= 1) {
          setHandXCoordinate(0);
          clearInterval(interval);

          setTimeout(() => {
            handleHandEntry(index + 1);
          }, 500);
        } else {
          // get new hand position
          const newPosition = progress * goalDistance;
          setHandXCoordinate(newPosition);
        }
      }, 32);

    };

    handleHandEntry(0); // Start with 0 Index

    return () => {
      if (interval) clearInterval(interval); 
    };
  }, [isCameraReady]);
  
  const handleAddScore = (rating: string, difficulty: string) => {
    dispatch(addScore(rating, difficulty));
  };

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: `url(${IMAGES.bg_game})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isCameraReady && <SplashScreenAnimation />}

      {/* Status Header */}
      <div className="flex row justify-center">
        <h2 className="font-moko-regular mt-8 mb-6 text-5xl text-emerald-950">
          {formatTime(state.song_duration)}
        </h2>
        <h1 className="absolute left-16 top-24 font-moko-glitch -rotate-10  text-6xl font-bold text-fuchsia-900 z-2">
          {state.score}
        </h1>
      </div>

      <div className="w-screen h-[60vh] flex justify-center content-center">
        {/* user camera */}
        <div className="relative ml-8 h-full aspect-video rounded-lg">
          {/* ***object-cover is important to match the ratio */}
          <video
            className="absolute aspect-video w-full h-full object-cover  rounded-md"
            ref={videoRef}
            id="webcam"
            autoPlay
            muted
            playsInline
          />
          <canvas
            className="absolute aspect-video w-full h-full object-cover  rounded-md"
            ref={canvasRef}
            id="output_canvas"
            style={{
              boxShadow:
                "inset 0 0 0 8px rgba(255, 0, 255, 0.8), inset 0 0 50px rgba(0, 0, 200, 0.7), 0 0 10px rgba(0, 0, 255, 0.8)",
            }}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end content-center">
        <div style={{ transform: `translateX(-${handXCoordinate}px)` }}>
          <img
            src={IMAGES[state.currentSymbol as keyof typeof IMAGES]}
            className="w-28 h-32"
            alt="Hand"
          />
          <h2 className="4xl text-center font-bold">{state.currentSymbol}</h2>
        </div>
      </div>

      <div className="absolute bottom-2 w-md">
        <button
          onClick={() => handleAddScore("PERFECT", "Medium")}
          className="px-4 py-2 bg-violet-300 "
        >
          Add PERFECT Score
        </button>
        <button
          onClick={() => handleAddScore("PERFECT", "Medium")}
          className="px-4 py-2 bg-violet-300"
        >
          Add GOOD Score
        </button>

        <button
          onClick={() => handleAddScore("PERFECT", "Medium")}
          className="px-4 py-2 bg-violet-300"
        >
          Add OK Score
        </button>
        <button
          onClick={() => handleAddScore("MISS", "Medium")}
          className="px-4 py-2 bg-violet-300"
        >
          Add MISS Score
        </button>
        <h2>Countdown till next hand: {state.currentHandDuration}</h2>

        <h2>Current Prompt: {state.currentPrompt}</h2>
      </div>
    </div>
  );
};

export default GamePage;
