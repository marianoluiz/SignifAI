import { NavLink, useLocation } from "react-router";
import { IMAGES } from "../../../constants/images";
import { saveScore } from "../../../utils/firebase";
import { useEffect, useState } from "react";
import useAudio from "../../../hooks/useAudio";
import { AUDIO } from "../../../constants/audio";

const ResultPage = () => {
  const location = useLocation();
  const { score, song_title } = location.state || {};
  const [ username, setUsername ] = useState("");
  const [ showModal, setShowModal ] = useState(false);
  const clickSound = useAudio(AUDIO.click_sound);
  const victoryMLsound = useAudio(AUDIO.victoryMLSound);
  
  useEffect(() => {
    victoryMLsound.playAudio();
  }, [victoryMLsound])

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
      <img
        className="ml-20 size-140 select-none pointer-events-none"
        src={IMAGES.result_hand_design}
        alt="Hand Trophy Design"
        draggable="false"
      />
      {/* parent col */}
      <div className="flex flex-col gap-12 mr-20">
        {/* score col */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-4xl text-center text-white">You got</p>
            <p className="text-2xl text-center text-white">
              Song: {song_title}
            </p>
          </div>

          <img
            src={IMAGES.result_stars}
            className="select-none pointer-events-none"
            alt="Stars"
          />

          <div className="px-2 py-2 flex justify-center items-center border-4 border-white rounded-xl">
            <span className="text-8xl text-white">{score}</span>
          </div>
        </div>

        {/* input name col */}
        <div>
          <span className="text-xl text-white mb-4">
            Enter your name save your score
          </span>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-lg text-gray-100 rounded-lg border-2 border-white focus:outline-none focus:ring-4 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
          />
          <button
            className="mt-4 px-20 py-2 cursor-pointer rounded-lg bg-fuchsia-800 text-white"
            onClick={() => {
              saveScore(score, song_title, username);
              setShowModal(true);
              clickSound.playAudio()
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Score Saved!
            </h2>
            <p className="text-gray-600 mb-6">
              Score has been successfully saved to the leaderboard.
            </p>

            <NavLink
              to="/"
              className="px-6 py-2 bg-violet-500 text-white rounded-md"
              onClick={() => {
                setShowModal(false)
                clickSound.playAudio()
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