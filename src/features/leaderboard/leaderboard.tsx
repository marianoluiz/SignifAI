import { NavLink } from "react-router";
import { IMAGES } from "../../constants/images";
import { fetchScore } from "../../utils/firebase";
import { useEffect, useState } from "react";

const LeaderboardPage = () => {
  interface Entry {
    name: string;
    song: string;
    score: number;
  }
  
  const [entries, setEntries] = useState<Entry[]>([]);

  /* Get Score */
  useEffect(() => {
    const getScores = async () => {
      try {
        const fetchedScores = await fetchScore("leaderboards");
        setEntries(fetchedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    getScores();
  }, []);

  return (
    <div className="relative flex items-center w-screen h-screen bg-gradient-to-b from-white to-gray-300">
      <img
        src={IMAGES.disco_img}
        className="absolute top-16 z-4 w-120"
        alt="Disco Ball Image"
      />
      <NavLink
        to="/"
        className="absolute bottom-12 left-40 px-6 py-3 bg-cyan-500 text-white text-lg rounded-lg shadow-md z-5"
      >
        Home
      </NavLink>
      {/* scores */}
      <div className="w-160 h-168 absolute right-25 px-2 flex flex-col">
        {/* title colns */}
        <div className="flex justify-between items-center">
          <span className="text-6xl text-cyan-500">LEADERBOARD </span>
          <span className="text-3xl">SCORE </span>
        </div>

        <div className="flex flex-col gap-2 mt-8 overflow-y-auto">
          {/* Array map implementation Soon */}
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between px-8 py-4 rounded-md bg-gradient-to-b from-white to-gray-300"
              >
                <span className="text-md w-40">{entry.name || "Anonymous"}</span>
                <span className="text-md w-30">{entry.song || "Anonymous"}</span>
                <span className="text-md w-10">{entry.score || 0}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No scores available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;