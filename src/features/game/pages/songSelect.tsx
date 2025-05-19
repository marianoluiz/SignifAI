import { useState } from "react";
import { NavLink } from "react-router";
import songs_config from "../../../config/songs_config.json";
import { IMAGES } from "../../../constants/images";
import { AUDIO } from "../../../constants/audio";
import useAudio from "../../../hooks/useAudio";
import useDeviceType from "../hooks/useDeviceType";

/**
 * SongSelectPage Component
 *
 * This component allows the player to select a song for the game. It displays a carousel-like UI
 * where the player can navigate between songs and select one to play. The component integrates
 * animations, audio effects, and dynamic song data from a configuration file.
 *
 * Features:
 * - Displays a carousel of songs with animations for navigation. uses circular indexing to loop ui
 *    - tracks the index of the initially centered using currentIndex state
 *    - prev and next moves that the currentIndex in a circular manner
 *
 * - Allows the player to navigate between songs using left and right buttons.
 * - Plays a click sound when navigating or selecting a song.
 * - Dynamically loads song data (title, author, and images) from a JSON configuration file.
 *
 * Dependencies:
 * - `useAudio`: Custom hook for playing audio effects.
 * - `songs_config`: JSON configuration file containing song details.
 * - `IMAGES` and `AUDIO`: Static assets for visuals and sounds.
 *
 * State:
 * - `currentIndex`: Tracks the currently centered song in the carousel.
 * - `directionAnimation`: Determines the animation direction ("left" or "right").
 *
 * Example Usage:
 * ```tsx
 * <SongSelectPage />
 * ```
 */
const SongSelectPage = () => {
  // Play click sound when navigating or selecting a song
  const clickSound = useAudio(AUDIO.click_sound);

  // Load song options from the JSON configuration file
  const song_options = songs_config.songs;

  // get device type from a hook
  const deviceType = useDeviceType();

  // Panel Button Styles
  // Blue images for inactive panels
  const panelImgBlue = [
    IMAGES.you_belong_w_me_album,
    IMAGES.wonderful_world_album,
    IMAGES.count_on_me_album,
  ];

  // Purple images for the active panel
  const panelImgPurple = [
    IMAGES.you_belong_w_me_palbum,
    IMAGES.wonderful_world_palbum,
    IMAGES.count_on_me_palbum,
  ];

  // State to track the current centered song in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // State to determine the animation direction ("left" or "right")
  const [directionAnimation, setDirectionAnimation] = useState<
    "left" | "right"
  >("right");

  /**
   * Helper function: Calculates the index in a circular way.
   * If `currentIndex + offset` is out of bounds, it wraps around using modulo.
   *
   * @param offset - The offset to apply to the current index.
   * @returns The calculated index.
   */
  const getIndex = (offset: number) =>
    (currentIndex + offset + song_options.length) % song_options.length;

  /**
   * Builds an array of the 3 visible items in the carousel: previous (-1), current (0), next (+1).
   * This runs whenever `currentIndex` changes.
   * if small screen, array only [ 0 ]
   */
  const visibleItems = [-1, 0, 1].map((offset) => {
    const index = getIndex(offset); // Get actual index with circular logic
    return { label: song_options[index], key: index }; // Assign has a song configs to label and the got index in key
  });

  /**
   * Handles the "Previous" button click.
   * Moves to the previous song in the carousel (looping).
   */
  const handlePrev = () => {
    clickSound.playAudio();
    setDirectionAnimation("right");
    setCurrentIndex(
      (prev) => (prev - 1 + song_options.length) % song_options.length
    );
  };

  /**
   * Handles the "Next" button click.
   * Moves to the next song in the carousel (looping).
   */
  const handleNext = () => {
    clickSound.playAudio();
    setDirectionAnimation("left");
    setCurrentIndex((prev) => (prev + 1) % song_options.length);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGES.select_scr_bg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Back Button */}
      <NavLink
        to="/"
        className="absolute top-16 -left-4 -rotate-16 px-20 py-4 bg-linear-to-r from-purple-600 to-transparent backdrop-filterbackdrop-blur text-white"
        onClick={() => clickSound.playAudio()}
      >
        <span className="text-xl">Back</span>
      </NavLink>

      {/* Slider */}
      <div className="w-screen h-screen flex justify-center items-center">
        {/* Control Button: Previous */}
        <button
          onClick={handlePrev}
          className="text-3xl lg:text-6xl px-4 py-2 cursor-pointer text-violet-800 font-mokokoto-regular hover:scale-105"
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
              ${deviceType === "mobile" ? (i === 1 ? "block" : "hidden") : ""}
              hover:scale-105 transition-all
              `}
            onClick={() => clickSound.playAudio()}
            key={song.key} /* Unique key for each item */
          >
            {/* Panel Image */}
            <img
              src={i === 1 ? panelImgPurple[song.key] : panelImgBlue[song.key]}
              className={`select-none pointer-events-none
                ${i === 1 ? "md:w-124" : "md:w-92"}`}
              alt="Panel Button Image"
              draggable="false"
            />

            {/* Panel Title */}
            <div
              className={`absolute min-w-36 -rotate-6 -left-4 py-2 px-4 bg-white drop-shadow-lg/50 flex justify-center  z-2
                ${i === 1 ? "bottom-20" : "bottom-17"}`}
            >
              <span className="text-center text-sm sm:text-md lg:text-lg text-fuchsia-900 font-bold">
                {song.label.title}
              </span>
            </div>

            {/* Panel Author */}
            <span
              className={`absolute text-xs sm:text-xs lg:text-sm -rotate-6 pt-6 py-2 px-4 bg-white drop-shadow-lg/50 z-1
                ${i === 1 ? "left-11 bottom-12" : "left-3 bottom-8"}`}
            >
              By {song.label.author}
            </span>
          </NavLink>
        ))}

        {/* Control Button: Next */}
        <button
          onClick={handleNext}
          className="text-3xl lg:text-6xl px-4 py-2 cursor-pointer text-violet-800 font-mokokoto-regular hover:scale-105"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SongSelectPage;
