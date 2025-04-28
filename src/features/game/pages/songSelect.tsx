import { NavLink } from "react-router";
import { IMAGES } from "../../../constants/images";
import { AUDIO } from "../../../constants/audio"
import useAudio from "../../../hooks/useAudio";

import songs_config from "../../../config/songs_config.json"

const SongSelectPage = () => {
  const clickSound = useAudio(AUDIO.click_sound)

  // from json
  const song_details = songs_config.songs;
  
  // Panel Button Styles
  const panelImg = [IMAGES.choice_frame1, IMAGES.choice_frame2];
  const panelStyles = [
    {
      size: "size-72",
      subtitle_left: "12px",
      subtitle_bottom: "32px",
    },
    {
      size: "size-112",
      subtitle_left: "44px",
      subtitle_bottom: "44px",
    },
  ];

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
        className="w-screen h-screen flex justify-center items-center gap-12"
      >
        {/* Map the songs */}
        {song_details.map((song, index) => (
          <NavLink
            to={`/play/song/${song.var_name}`}
            className={"relative"}
            onClick={() => clickSound.playAudio()}
            key={index}
          >
            {/* modulo 2 since img are either 0 or 1 */}
            <img
              src={panelImg[index % 2]}
              className={`${panelStyles[index % 2].size}`}
              alt="Panel Button Image"
            />
            <div
              className={`absolute min-w-36 -rotate-6 bottom-20 -left-4 py-2 px-4 bg-white drop-shadow-lg/50 flex justify-center`}
            >
              <span className="text-center">{song.title}</span>
            </div>
            <span
              className={`absolute -rotate-6 py-2 px-4`}
              style={{
                left: `${panelStyles[index % 2].subtitle_left}`,
                bottom: `${panelStyles[index % 2].subtitle_bottom}`,
              }}
            >
              By {song.author}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SongSelectPage;