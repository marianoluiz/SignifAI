import { useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router";

import { IMAGES } from "../../../constants/images"
import { AUDIO } from "../../../constants/audio";
import { SplashScreenAnimation } from "../../../components/SplashScreenAnimation";
import songs_config from "../../../config/songs_config.json";
import { gameReducer } from "../gameReducer";
import useAudio from "../../../hooks/useAudio";

import { formatTime } from "../../../utils/timeHelpers"
import { useCamera } from "../../../globals/camera/cameraContext";
import { useCameraSetup } from "../hooks/useCameraSetup";
import { useGameSetup } from "../hooks/useGameSetup";
import { useGameTimer } from "../hooks/useGameTimer";
import { useHandMovement } from "../hooks/useHandMovement";

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

  // Camera status and refs
  // Provides camera readiness status and references to the video and canvas elements
  const { isCameraReady, setIsCameraReady, canvasRef, videoRef } = useCamera();
  
  // Local States
  // Tracks the X-coordinate of the hand's position and whether all hand signs are completed
  const [handXCoordinate, setHandXCoordinate] = useState(0);
  const [areHandsignsDone, setAreHandsignsDone] = useState(false);

  // Reducer States with initial state
  // Manages the game's state, including song duration, score, current hand sign, and ratings
  const [state, dispatch] = useReducer(gameReducer, {
    song_duration: wholeSongDuration, // Total duration of the song
    score: 0, // Player's current score
    currentSymbol: "bg_glitch1" as keyof typeof IMAGES, // Current hand sign symbol
    currentPrompt: "No Prompt", // Current text prompt for the hand sign
    currentRating: "No Rating", // Current rating (e.g., PERFECT, GOOD, etc.)
  });

  // Camera setup logic
  // Configures the camera and prepares it for use
  useCameraSetup(videoRef, canvasRef, setIsCameraReady);

  // Game setup logic
  // Initializes the game when the camera is ready
  useGameSetup(isCameraReady, song, dispatch, wholeSongDuration);

  // Game timer logic
  // Starts and ends the game based on the song's duration
  useGameTimer(state.song_duration, dispatch, navigate, state, song_details?.title ?? "Unknown Title");

  // Hand movement logic
  // Handles the movement of hand signs and evaluates player performance
  useHandMovement(isCameraReady, song_entries, dispatch, setAreHandsignsDone, setHandXCoordinate);

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: `url(${
          IMAGES[`${song_var}_bg` as keyof typeof IMAGES]
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isCameraReady && <SplashScreenAnimation />}

      {/* Status Header */}
      <div className="flex row justify-center">
        <h2
          className={`font-moko-regular mt-8 mb-6 text-5xl 
            ${song_var === "count_on_me" ? "" : "text-purple-400"}`}
        >
          {formatTime(state.song_duration)}
        </h2>
        <h1 className="absolute left-16 top-24 font-moko-glitch -rotate-10  text-6xl font-bold text-purple-700 z-2">
          {state.score}
        </h1>
      </div>

      <div className="w-screen h-[60vh] flex justify-center content-center">
        {/* user camera */}
        <div className="relative ml-8 h-full aspect-video rounded-lg">
          {/* Video feed from the user's camera */}
          {/* ***object-cover is important to match the ratio */}
          <video
            className="absolute aspect-video w-full h-full object-cover  rounded-md"
            ref={videoRef}
            id="webcam"
            autoPlay
            muted
            playsInline
          />
          {/* Canvas for the drew hand landmarks */}
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
      <div className="mt-4 h-40 flex relative justify-end content-center">
        {/* Rating */}
        <div className="absolute h-full animate-fade-in z-9 right-180">
          <img
            key={state.currentRating}
            className="h-full animate-fade-in"
            src={
              IMAGES[
                `${state.currentRating}_rating_effect` as keyof typeof IMAGES
              ]
            }
            alt="Rating"
          />
        </div>

        {/* Hand signs */}
        {!areHandsignsDone && (
          <div
            className="py-2 px-1 rounded-xs bg-[rgba(0,0,0,0.1)] z-10"
            style={{ transform: `translateX(-${handXCoordinate}px)` }}
          >
            <img
              src={
                IMAGES[
                  state.currentSymbol === "I love you"
                    ? "I_love_you"
                    : (state.currentSymbol as keyof typeof IMAGES)
                ]
              }
              className="w-28 h-32"
              alt="Hand"
            />
            <h2 className="4xl text-center text-white font-bold">
              {state.currentSymbol}
            </h2>
          </div>
        )}

        {/* Area bars */}
        {/* Visual indicators for scoring zones */}
        <div
          className="absolute w-8 h-full bg-gradient-to-b from-green-400 via-green-500 to-green-400 z-4"
          style={{ transform: "translateX(-628px)" }}
        ></div>
        <div
          className="absolute w-16 h-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-400 z-3"
          style={{ transform: "translateX(-596px)" }}
        ></div>
        <div
          className="absolute w-32 h-full bg-gradient-to-b from-fuchsia-400 via-fuchsia-500 to-fuchsia-400 z-2"
          style={{ transform: "translateX(-532px)" }}
        ></div>
        <div
          className="absolute w-100 h-full bg-gradient-to-b from-red-500 via-red-500 to-red-400 z-1"
          style={{ transform: "translateX(-260px)" }}
        ></div>
      </div>

      <div className="absolute bottom-2 w-md">
        <h2 className="text-4xl text-white">
          Current Prompt: {state.currentPrompt}
        </h2>
        <h2>Current Rating: {state.currentRating}</h2>
        <h2>Current Symbol: {state.currentSymbol}</h2>
      </div>
    </div>
  );
};

export default GamePage;
