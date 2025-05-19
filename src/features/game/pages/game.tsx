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
import useShowRating from "../hooks/useShowRating";
import useDeviceType from "../hooks/useDeviceType";
import splitLyrics from "../utils/splitLyrics";

/**
 * GamePage Component
 * 
 * This component handles the main gameplay logic, including camera setup, hand movement tracking,
 * game state management, and rendering the game UI. It integrates various hooks and utilities
 * to manage the game's lifecycle and interactions.
 * 
 * Features:
 * - Fetches song details and plays the selected song.
 * - Sets up the camera and tracks hand movements.
 * - Manages game state using a reducer (e.g., score, current hand sign, ratings).
 * - Displays the game UI, including the timer, score, hand signs, and rating effects.
 * 
 * Dependencies:
 * - `useAudio`: Custom hook for playing audio.
 * - `useCamera`: Provides camera readiness status and references to video and canvas elements.
 * - `useCameraSetup`: Configures the camera for gameplay.
 * - `useGameSetup`: Initializes the game when the camera is ready.
 * - `useGameTimer`: Manages the game's timer and handles game end logic.
 * - `useHandMovement`: Tracks hand movements and evaluates player performance.
 * - `useShowRating`: Manages the visibility of the rating effect.
 * 
 * State:
 * - `state`: Managed by a reducer, includes song duration, score, current hand sign, and ratings.
 * - `handXCoordinate`: Tracks the X-coordinate of the hand's position.
 * - `areHandsignsDone`: Tracks whether all hand signs are completed.
 * - `showRating`: Controls the visibility of the rating effect.
 * 
 */
const GamePage = () => {
  const navigate = useNavigate();

  // fetch song
  const { song_var } = useParams();

  const deviceType = useDeviceType();

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
    currentLyrics: "No Lyrics" as keyof typeof IMAGES, // Current hand sign symbol
    currentPrompt: "No Prompt", // Current text prompt for the hand sign
    currentRating: "No Rating", // Current rating (e.g., PERFECT, GOOD, etc.)
    timestamp: 0, // timestamp rating used later to rerender rating effect even if rating dont change
  });

  // Camera setup logic Hook
  // Configures the camera and prepares it for use
  useCameraSetup(videoRef, canvasRef, setIsCameraReady);

  // Game setup logic Hook
  // Initializes the game when the camera is ready
  useGameSetup(isCameraReady, song, dispatch, wholeSongDuration);

  // Game timer logic Hook
  // Starts and ends the game based on the song's duration
  // Passes score and song title to the result page after song is done
  useGameTimer(
    state.song_duration,
    dispatch,
    navigate,
    state,
    song_details?.title ?? "Unknown Title"
  );

  // Hand movement logic Hook
  // Handles the movement of hand signs and evaluates player performance
  useHandMovement(
    isCameraReady,
    song_entries,
    dispatch,
    setAreHandsignsDone,
    setHandXCoordinate,
    deviceType ?? "pc"
  );

  // Rating manager  hook
  // Handles the rating effect duration
  // we pass the timestamp of rating to rerender the rating effect
  // even if rating dont change
  const [showRating] = useShowRating(state.currentRating, state.timestamp);

  return (
    /* Screen Container */
    <div
      className="w-screen h-screen flex flex-col justify-center"
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
      <div
        className="flex justify-center items-center
                   pb-2 pt-4
                   sm:pt-8
                   md:pb-12 
                   lg:pb-2
      "
      >
        <h2
          className={`font-moko-regular text-3xl sm:text-5xl
            ${song_var === "count_on_me" ? "" : "text-purple-400"}`}
        >
          {formatTime(state.song_duration)}
        </h2>
        <h1
          className="absolute font-moko-glitch -rotate-10 font-bold text-purple-700 z-2
                    left-8 top-20 text-3xl md:text-6xl
                    md:left-16 md:top-36
                    lg:left-16 lg:top-24 lg:text-6xl"
        >
          {state.score}
        </h1>
      </div>

      {/* Camera Container */}
      <div className="w-screen h-[25vh] md:h-[30vh] lg:h-[60vh] flex justify-center content-center">
        {/* user camera */}
        <div className="relative ml-0 lg:ml-8 h-full aspect-video rounded-lg">
          {/* Video feed from the user's camera */}
          <video
            className="absolute aspect-video w-full h-full object-cover rounded-md"
            ref={videoRef}
            id="webcam"
            autoPlay
            muted
            playsInline
          />
          {/* Canvas for the drew hand landmarks */}
          <canvas
            className="absolute aspect-video w-full h-full object-cover rounded-md"
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
      <div
        className="mt-4 flex relative justify-end content-center
                    h-30
                    sm:h-40
      "
      >
        {/* Lyrics and Prompt */}
        {!areHandsignsDone && (
          <div
            className="absolute
                          left-10 top-35
                          md:left-50 md:top-50
                          lg:left-30 lg:top-0
                          2xl:left-80 2xl:top-8"
          >
            <div className="bg-[rgba(0,0,0,0.5)] px-4 py-4">
              <h2 className="text-sm md:text-lg lg:text-lg text-white">
                {/* helper function to split lyrics */}
                {splitLyrics(state.currentLyrics).map((line, index, arr) => {
                  return (
                    <span key={line}>
                      {line} 
                      {index !== arr.length - 1 && <br />}
                    </span>
                  )
                })}
                <span className="text-red-500">{state.currentPrompt}</span>
              </h2>
            </div>
          </div>
        )}

        {/* Rating */}
        {showRating && (
          <div
            className="absolute h-full animate-fade-in z-9 transition-all
                        right-65
                        sm:w-auto
                        md:right-135
                        lg:right-140
                        xl:right-180
          "
          >
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
        )}

        {/* Hand signs, width is 120 */}
        {!areHandsignsDone && (
          <div
            className="py-2 px-1 h-full rounded-xs bg-[rgba(0,0,0,0.1)] z-10"
            style={{ transform: `translateX(-${handXCoordinate}px)` }}
          >
            <img
              src={IMAGES[state.currentSymbol as keyof typeof IMAGES]}
              className="w-full h-[80%]"
              alt="Hand"
            />
            <h2 className="4xl h-[20%] text-center text-gray-300 font-bold">
              {state.currentSymbol}
            </h2>
          </div>
        )}

        {/* Area bars */}
        {/* Visual indicators for scoring zones */}
        {/* To get right width of bar, perfect - rateZone */}
        {/* Desktop mode: handsign half: 60px, perfect: 600px, rateZone: 16px, 32px, 200px, 400px (600-200 <rateZone>) */}
        {/* Tablet mode: handsign half: 60px, perfect: 400px, rateZone: 16px, 32px, 100px, 300px (400-100 <rateZone>) */}
        {/* Mobile mode: handsign half: 60px, perfect: 200px, rateZone: 16px, 32px, 96px, 190px (200-10 <rateZone>) */}

        {/* How many should i move this bar left side to reach 660px ?*/}
        {/* PERFECT */}
        {/* 60-32 is 28 so i need to add 600 by 28 = 628px*/}
        {/* 60-32 is 28 so i need to add 400 by 28 = 428px*/}
        {/* 60-32 is 28 so i need to add 600 by 28 = 228px*/}
        <div
          className="absolute w-8 h-full bg-gradient-to-b from-green-400 via-green-500 to-green-400 z-4
                    right-[228px]
                    md:right-[428px]
                    xl:right-[628px]
        "
        ></div>
        {/* GOOD */}
        {/* 60-64 is -4 so i need to reduce 600 by 4 = 596px */}
        {/* 60-64 is -4 so i need to reduce 400 by 4 = 396px */}
        {/* 60-64 is -4 so i need to reduce 200 by 4 = 196px */}
        <div
          className="absolute w-16 h-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-400 z-3
                    right-[196px] 
                    md:right-[396px] 
                    xl:right-[596px] 
        "
        ></div>
        {/* OK */}
        {/* 60-128 is -68 so i need to reduce 600 by 68 = 532px */}
        {/* 60-128 is -68 so i need to reduce 400 by 68 = 332px */}
        {/* 60-96 is -36 so i need to reduce 200 by 36 = 164px */}

        <div
          className="absolute h-full bg-gradient-to-b from-fuchsia-400 via-fuchsia-500 to-fuchsia-400 z-2
                    w-24 right-[164px] 
                    md:w-32 md:right-[332px] 
                    xl:w-32 xl:right-[532px] 
        "
        ></div>
        {/* MISS */}
        {/* 60-400 is -340 so i need to reduce 600 by 340 = 260 */}
        {/* 60-300 is -240 so i need to reduce 400 by 240 = 160 */}
        {/* 60-180 is -120 so i need to reduce 200 by 120 = 80 */}
        <div
          className="absolute  h-full bg-gradient-to-b from-red-500 via-red-500 to-red-400 z-1
                    w-45 right-[80px]
                    md:w-75 md:right-[160px] 
                    xl:w-100 xl:right-[260px] 
        "
        ></div>
      </div>
    </div>
  );
};

export default GamePage;
