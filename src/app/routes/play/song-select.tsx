import { NavLink } from "react-router";
import { IMAGES } from "../../../constants/images";
import { AUDIO } from "../../../constants/audio"
import useAudio from "../../../hooks/useAudio";

const SongSelectPage = () => {
  const clickSound = useAudio(AUDIO.click_sound)

  const song_ids = [1, 2, 3];

  return (
    <div>
      {/* Back btn */}
      <NavLink
        to="/"
        className="absolute top-16 -left-4 -rotate-16 px-20 py-4 bg-linear-to-r from-purple-600 to-transparent  backdrop-filterbackdrop-blur text-white"
        onClick={() => clickSound.playAudio()}
      >
        <span className="text-xl">Back</span>
      </NavLink>

      {/* Background */}
      <div
        style={{
          backgroundImage: `url(${IMAGES.select_scr_bg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="w-screen h-screen flex justify-center items-center"
      >
        {/* Map the songs */}
        {song_ids.map((song_id) => (
          <NavLink
            to={`/play/song/${song_id}`}
            className=" px-4 py-2 bg-violet-500 text-white rounded-md"
          >
            Choose Song
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SongSelectPage;