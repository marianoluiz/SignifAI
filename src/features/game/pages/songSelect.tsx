import { NavLink } from "react-router";
import { IMAGES } from "../../../constants/images";
import { AUDIO } from "../../../constants/audio"
import useAudio from "../../../hooks/useAudio";

import songs_config from "../../../config/songs_config.json"
import { useState } from "react";

const SongSelectPage = () => {
  const clickSound = useAudio(AUDIO.click_sound);

  // songs config from json
  const song_options = songs_config.songs;

  // Panel Button Styles
  const panelImgBlue = [
    IMAGES.wonderful_world_album,
    IMAGES.count_on_me_album,
    IMAGES.you_belong_w_me_album,
  ];

  const panelImgPurple = [
    IMAGES.wonderful_world_palbum,
    IMAGES.count_on_me_palbum,
    IMAGES.you_belong_w_me_palbum,
  ];

  // This state keeps track of the currently centered item
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determines what animation will happen to the panel
  const [directionAnimation, setDirectionAnimation] = useState<
    "left" | "right"
  >("right");

  // Helper function: Calculates the index in a circular way
  // If currentIndex + offset is out of bounds, it wraps around using modulo
  const getIndex = (offset: number) =>
    (currentIndex + offset + song_options.length) % song_options.length;

  // Build an array of the 3 visible items: previous (-1), current (0), next (+1)
  // runs when currentIndex is changed
  const visibleItems = [-1, 0, 1].map((offset) => {
    const index = getIndex(offset); // Get actual index with circular logic
    return { label: song_options[index], key: index }; // Each item have label and index
  });


  // These Next and Prev works like inverted
  // When right arrow is clicked, move to the next item (looping)
  // When you click ➡: move to next index (0 → 1 → 2 → 0)
  const handlePrev = () => {
    clickSound.playAudio();
    setDirectionAnimation("left");
    setCurrentIndex((prev) => (prev + 1) % song_options.length);
  }

  // When left arrow is clicked, move to the previous item (looping)
  // When you click ⬅: move to previous (0 → 2 → 1 → 0)
  const handleNext = () => {
    clickSound.playAudio();
    setDirectionAnimation("right");
    setCurrentIndex(
      (prev) => (prev - 1 + song_options.length) % song_options.length
    );
  };

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
        {/* Control Button: Previous */}
        <button
          onClick={handlePrev}
          className="px-4 py-2 cursor-pointer text-violet-800 text-6xl font-mokokoto-regular hover:scale-105 "
        >
          &lt;
        </button>

        {/* Map the songs */}
        {visibleItems.map((song, i) => (
          <NavLink
            to={`/play/song/${song.label.var_name}`}
            className={`relative select-none
              ${
                i === 1
                  ? directionAnimation === "left"
                    ? "animate-slide-left"
                    : "animate-slide-right"
                  : ""
              }
              hover:scale-105 transition-all
              `}
            onClick={() => clickSound.playAudio()}
            key={song.key} /* actual unique key for item*/
          >
            {/* Panel Image */}
            <img
              src={i === 1 ? panelImgPurple[song.key] : panelImgBlue[song.key]}
              className={`select-none pointer-events-none
                ${i === 1 ? "size-124" : "size-92"}`}
              alt="Panel Button Image"
              draggable="false"
            />

            {/* Panel Title */}
            <div
              className={`absolute min-w-36 -rotate-6 -left-4 py-2 px-3 bg-white drop-shadow-lg/50 flex justify-center transition-all z-2
                ${i === 1 ? "bottom-20" : "bottom-17"}
                `}
            >
              <span className="text-center text-fuchsia-900 transition-all font-bold">
                {song.label.title}
              </span>
            </div>

            {/* Panel Author */}
            <span
              className={`absolute -rotate-6 pt-6 pr-6 py-2 px-4 bg-white drop-shadow-lg/50 z-1
                ${i === 1 ? "left-11 bottom-11" : "left-3 bottom-8"}`}
            >
              By {song.label.author}
            </span>
          </NavLink>
        ))}

        {/* Control Button: Next */}
        <button
          onClick={handleNext}
          className="px-4 py-2 cursor-pointer text-violet-800 text-6xl font-mokokoto-regular hover:scale-105 "
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SongSelectPage;