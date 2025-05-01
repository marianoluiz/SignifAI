import { NavLink, useLocation } from "react-router";
import { IMAGES } from "../../../constants/images";

const ResultPage = () => {

  const location = useLocation();
  const { score, song_title } = location.state || {}; 

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
          <div className="flex justify-between">
            <p className="text-4xl text-center text-white">Score: </p>
            <p className="text-4xl text-center text-white">Song: {song_title}</p>
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
            Enter your name to save to leaderboard
          </span>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 mt-4 text-lg text-gray-100 rounded-lg border-2 border-white focus:outline-none focus:ring-4 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
          />
          <button className="mt-4 px-20 py-2 cursor-pointer rounded-lg bg-fuchsia-800 text-white">
            Save
          </button>
        </div>
      </div>
      <NavLink
        to="/"
        className="absolute bottom-0 m-8 px-4 py-2 bg-violet-500 text-white rounded-md"
      >
        Back to Home
      </NavLink>
    </div>
  );
};

export default ResultPage;