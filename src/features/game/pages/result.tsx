import { useNavigate, NavLink, useLocation } from "react-router";
import { IMAGES } from "../../../constants/images";
import { saveScore } from "../../../utils/firebase";
import { useEffect, useState } from "react";
import useAudio from "../../../hooks/useAudio";
import { AUDIO } from "../../../constants/audio";
/**
 * ResultPage Component
 * 
 * This component displays the result screen after the game ends. It shows the player's score,
 * allows the player to save their score to the leaderboard, and provides navigation back to the home page.
 * 
 * Features:
 * - Displays the player's score and the song title.
 * - Allows the player to input their name and save their score to the leaderboard.
 * - Plays a victory sound when the page loads.
 * - Shows a modal popup confirming that the score has been saved.
 * 
 * Dependencies:
 * - `useLocation`: Retrieves the score and song title passed from the game page.
 * - `useAudio`: Custom hook for playing audio effects.
 * - `saveScore`: Utility function to save the player's score to Firestore.
 * - `IMAGES` and `AUDIO`: Static assets for visuals and sounds.
 * 
 * State:
 * - `username`: Stores the player's inputted name.
 * - `showModal`: Controls the visibility of the modal popup.
 * 
 */
const ResultPage = () => {
  // Retrieve the score and song title from the location state
  const location = useLocation();
  const navigate = useNavigate();

  // go back to selection page if no score and song title passed
  useEffect(() => {
    if (!location.state) {
      navigate("/play/select");
    }
  }, [location, navigate]);

  const { score, song_title } = location.state || {};

  // State to store the player's name
  const [username, setUsername] = useState("");

  // State to control the visibility of the modal popup
  const [showModal, setShowModal] = useState(false);

  // Audio hooks for playing sound effects
  const clickSound = useAudio(AUDIO.click_sound);
  const victoryMLsound = useAudio(AUDIO.victoryMLSound);

  // Play the victory sound after 500ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      victoryMLsound.playAudio();
    }, 500);

    return () => clearTimeout(timeout);
  }, [victoryMLsound]);

  return (
    /* row */
    <div
      className="w-screen h-screen flex gap-8 items-center"
      style={{
        backgroundImage: `url(${IMAGES.results_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative hand trophy design */}
      <img
        className="ml-20 size-140 select-none pointer-events-none"
        src={IMAGES.result_hand_design}
        alt="Hand Trophy Design"
        draggable="false"
      />
      {/* Main content column */}
      <div className="flex flex-col gap-12 mr-20">
        {/* Score display */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-4xl text-center text-white">You got</p>
            <p className="text-2xl text-center text-white">
              Song: {song_title}
            </p>
          </div>

          {/* Star design */}
          <img
            src={IMAGES.result_stars}
            className="select-none pointer-events-none"
            alt="Stars"
          />

          {/* Score display box */}
          <div className="px-2 py-2 flex justify-center items-center border-4 border-white rounded-xl">
            <span className="text-8xl text-white">{score}</span>
          </div>
        </div>

        {/* Input for saving the player's name */}
        <div>
          <span className="text-xl text-white mb-4">
            Enter your name save your score
          </span>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            maxLength={24}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-lg text-gray-100 rounded-lg border-2 border-white focus:outline-none focus:ring-4 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
          />
          <button
            className="mt-4 px-20 py-2 cursor-pointer rounded-lg bg-fuchsia-800 text-white"
            onClick={() => {
              saveScore(score, song_title, username); // Save the score to Firestore
              setShowModal(true); // Show the modal popup
              clickSound.playAudio(); // Play the click sound
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Modal popup for score confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Score Saved!
            </h2>
            <p className="text-gray-600 mb-6">
              Score has been successfully saved to the leaderboard.
            </p>

            {/* Navigation back to the home page */}
            <NavLink
              to="/"
              className="px-6 py-2 bg-violet-500 text-white rounded-md"
              onClick={() => {
                setShowModal(false); // Close the modal
                clickSound.playAudio(); // Play the click sound
              }}
            >
              Back to Home
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;