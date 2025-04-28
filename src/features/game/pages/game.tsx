import { useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router";

import { IMAGES } from "../../../constants/images"
import { AUDIO } from "../../../constants/audio";
import { SplashScreenAnimation } from "../../../components/SplashScreenAnimation";
import songs_config from "../../../config/songs_config.json";
import { gameReducer } from "../gameReducer";
import { addScore } from "../gameReducer";
import useAudio from "../../../hooks/useAudio";

import { formatTime } from "../../../utils/timeHelpers"
import { useCamera } from "../../../globals/camera/cameraContext";
import { useCameraSetup } from "../hooks/useCameraSetup";
import { useGameSetup } from "../hooks/useGameSetup";
import { useGameTimer } from "../hooks/useGameTimer";
import { useHandMovement } from "../hooks/useHandMovement";
import { getPrediction } from "../../../utils/modelHelper";
import { resultLandmarks } from "../../../utils/handLandmarkerHelper";

const GamePage = () => {
  const navigate = useNavigate();

  // fetch song
  const { song_var } = useParams();
  const song_details = songs_config.songs.find(
    (song) => song.var_name === song_var
  );
  const wholeSongDuration = song_details?.song_duration ?? 0;
  const song_entries = song_details?.entries;

  // play song in a global hook
  const song = useAudio(AUDIO[song_var as keyof typeof AUDIO]);

  // Local States
  const [handXCoordinate, setHandXCoordinate] = useState(0);
  const [areHandsignsDone, setAreHandsignsDone] = useState(false);

  // Reducer States with initial state
  const [state, dispatch] = useReducer(gameReducer, {
    song_duration: wholeSongDuration,
    score: 0,
    currentSymbol: "bg_glitch1" as keyof typeof IMAGES,
    currentPrompt: "No Prompt",
    currentRating: "No Rating",
  });

  // camera status and refs
  const { isCameraReady, setIsCameraReady, canvasRef, videoRef } = useCamera();

  // Call the useGameSetup hook to set up the game when the camera is ready.
  useGameSetup( isCameraReady, song, dispatch, wholeSongDuration );

  // Setup camera and sets the game to start
  useCameraSetup( videoRef, canvasRef, setIsCameraReady );

  // Start and End the game
  useGameTimer(state.song_duration, dispatch, navigate);

  // Handle the hand entries and hand movements
  useHandMovement(
    isCameraReady,
    song_entries,
    dispatch,
    setAreHandsignsDone,
    setHandXCoordinate
  );

  // soon
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

      {/* Hand Conveyer */}
      <div className="mt-8 flex relative justify-end content-center">
        {/* Hand signs */}
        {!areHandsignsDone && (
          <div
            className="py-2 px-1 rounded-xs bg-[rgba(0,0,0,0.1)] z-10"
            style={{ transform: `translateX(-${handXCoordinate}px)` }}
          >
            <img
              src={IMAGES[state.currentSymbol as keyof typeof IMAGES]}
              className="w-28 h-32"
              alt="Hand"
            />
            <h2 className="4xl text-center font-bold">{state.currentSymbol}</h2>
          </div>
        )}

        {/* Area bars */}
        <div
          className="absolute w-4 h-full bg-[rgba(52,211,153,0.8)] z-4"
          style={{ transform: "translateX(-552px)" }}
        ></div>
        <div
          className="absolute w-13 h-full bg-[rgba(135,255,245,0.8)] z-3"
          style={{ transform: "translateX(-535px)" }}
        ></div>
        <div
          className="absolute w-22 h-full bg-[rgba(118,143,255,0.8)] z-2"
          style={{ transform: "translateX(-518px)" }}
        ></div>
        <div
          className="absolute w-90 h-full bg-[rgba(208,136,255,0.8)] z-1"
          style={{ transform: "translateX(-359px)" }}
        ></div>
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
        <button
          onClick={()=> 
            getPrediction(resultLandmarks).then((result) => {
              console.log("Prediction result:", result);
            }) 
          }
          className="px-4 py-2 bg-red-300"
        > Predict 
        </button>
        <h2>Current Prompt: {state.currentPrompt}</h2>
        <h2>Current Rating: {state.currentRating}</h2>
      </div>
    </div>
  );
};

export default GamePage;
