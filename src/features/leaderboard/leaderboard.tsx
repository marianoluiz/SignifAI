import { NavLink } from "react-router";
import { useState } from "react";

import { IMAGES } from "../../constants/images";
import { AUDIO } from "../../constants/audio";
import useAudio from "../../hooks/useAudio";
import { Entry } from "./leaderboardTypes"
import useGetData from "./hooks/useGetData";

/**
 * LeaderboardPage Component
 * 
 * Renders the leaderboard page, displaying player scores fetched from Firestore.
 * Includes a disco ball design, a "Home" button with a click sound, and a scrollable list of scores.
 * Shows a loading spinner while fetching data.
 * 
 * Features:
 * - Fetches leaderboard scores on mount using the hook `useGetData`.
 * - Displays player names, songs, and scores in a scrollable list.
 * - Plays a click sound when the "Home" button is clicked.
 * 
 * Dependencies:
 * - `useGetData`: a hook that fetches leaderboard data from Firestore.
 * - `useAudio`: Custom hook for playing audio effects.
 * - `IMAGES` and `AUDIO`: Static assets for visuals and sounds.
 * 
 * State:
 * - `entries`: Stores the fetched leaderboard data.
 * 
 * Example Usage:
 * ```tsx
 * <LeaderboardPage />
 * ```
 */
const LeaderboardPage = () => {
  // Custom hook to play a click sound when the "Home" button is clicked
  const clickSound = useAudio(AUDIO.click_sound);

  // State to store leaderboard entries
  const [entries, setEntries] = useState<Entry[]>([]);

  // Custom hook that fetches data on mount of component
  // Fetch leaderboard scores, songs, and names on component mount
  useGetData(setEntries);

  return (
    <div
      className="
      relative overflow-hidden flex w-screen h-screen bg-gradient-to-b from-white to-gray-300
      flex-col-reverse items-center justify-around
      xl:flex-row xl:justify-between"
    >
      {/*Left Div */}
      <div className="flex flex-col items-center">
        <img
          src={IMAGES.disco_img}
          className="hidden xl:block z-4 w-120 select-none pointer-events-none"
          alt="Disco Ball Image"
          draggable="false"
        />
        <NavLink
          to="/"
          className="w-25 px-6 my-2 py-3 text-center bg-cyan-500 text-white text-lg rounded-lg shadow-md z-5"
          onClick={() => clickSound.playAudio()}
        >
          Home
        </NavLink>
      </div>

      {/* Right Div */}
      <div
        className="
        px-2 flex flex-col
        w-[90%] min-h-100
        sm:w-[80%] sm:max-h-260
        xl:w-160 xl:h-168 xl:mr-[5vw]"
      >
        {/* title colns */}
        <div className="flex justify-between items-center mt-8">
          <span className="text-3xl md:text-6xl text-cyan-500">
            LEADERBOARD{" "}
          </span>
          <span className="text-2xl md:text-3xl">SCORE </span>
        </div>

        <div className="flex flex-col gap-2 mt-8 overflow-y-auto">
          {/* Array map each entry*/}
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <div
                key={index}
                className="flex w-full justify-between px-8 py-4 rounded-md bg-gradient-to-b from-white to-gray-300"
              >
                <span className="text-sm mx-2 sm:text-md w-40">
                  {entry.name || "Anonymous"}
                </span>
                <span className="text-sm mx-2 sm:text-md w-30">
                  {entry.song || "Anonymous"}
                </span>
                <span className="text-sm mx-2 sm:text-md w-10">
                  {entry.score || 0}
                </span>
              </div>
            ))
          ) : (
            /* Loading Animation */
            <div className="w-full flex mt-32 justify-center items-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;