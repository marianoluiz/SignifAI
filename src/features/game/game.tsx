import { useEffect, useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router";

import { IMAGES } from "../../constants/images"
import { AUDIO } from "../../constants/audio";
import SplashScreen from "../../components/SplashScreen";
import songs_config from "../../config/songs_config.json";
import { gameReducer } from "./gameReducer";
import { setGame, addScore, reduceDuration, addHandEntry } from "./gameReducer";
import useAudio from "../../hooks/useAudio";
import useSplashScreen from "../../hooks/useSplashScreen";


const GamePage = () => {
  const navigate = useNavigate();

  const isSplashVisible = useSplashScreen();

  // song details
  const { song_var } = useParams();

  const song_details = songs_config.songs.find(
    (song) => song.var_name === song_var
  );
  const song = useAudio(AUDIO[song_var as keyof typeof AUDIO]);

  const initialSongDuration = song_details?.song_duration ?? 0;
  const song_entries = song_details?.entries;

  // states with initial state
  const [state, dispatch] = useReducer(gameReducer, {
    song_duration: 0,
    score: 0,
    handEntryCount: 0,
    currentHandDuration: 0,
  });

  // set game. do not put song as dependency
  useEffect(() => {
    song.playAudio();
    dispatch(setGame(initialSongDuration ?? 0));

    // cleanup function
    return () => {
      song.pauseAudio();
    };
  }, [initialSongDuration]);

  const handleAddScore = (rating: string, difficulty: string) => {
    dispatch(addScore(rating, difficulty));
  };

  const handleReduceDuration = () => {
    dispatch(reduceDuration());
  };

  const handleAddHandEntry = () => {
    dispatch(addHandEntry());
  };

  const [xCoordinate, setXCoordinate] = useState(0);

  // loop to subtract duration or end game
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.song_duration > 0) {
        dispatch(reduceDuration());
      } else {
        clearInterval(interval);
        window.prompt("Game Over!");
        navigate("/result");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.song_duration, navigate]);

  return (
    <div>
      {isSplashVisible && <SplashScreen />}

      <h1>Score: {state.score}</h1>
      <h2>Song Duration: {state.song_duration}</h2>
      <h2>Countdown till next hand: {state.currentHandDuration}</h2>
      <h2>Hand Entry Count: {state.handEntryCount}</h2>

      <div className="flex justify-end content-center">
        <img
          style={{ transform: `translateX(${xCoordinate}px)` }}
          src={IMAGES.a}
          alt="Hand"
        />
      </div>

      <button
        onClick={() => handleAddScore("PERFECT", "Medium")}
        className="px-4 py-2 bg-violet-500"
      >
        Add PERFECT Score
      </button>
      <button
        onClick={() => handleAddScore("PERFECT", "Medium")}
        className="px-4 py-2 bg-violet-500"
      >
        Add GOOD Score
      </button>

      <button
        onClick={() => handleAddScore("PERFECT", "Medium")}
        className="px-4 py-2 bg-violet-500"
      >
        Add OK Score
      </button>
      <button
        onClick={() => handleAddScore("MISS", "Medium")}
        className="px-4 py-2 bg-violet-500"
      >
        Add MISS Score
      </button>
      <button onClick={handleReduceDuration} className="px-4 py-2 bg-red-500"
      >
        Reduce Duration
      </button>
      <button onClick={handleAddHandEntry} className="px-4 py-2 bg-blue-500"
      >
        Add Hand Entry
      </button>
    </div>
  );
};

export default GamePage;
