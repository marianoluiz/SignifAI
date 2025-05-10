import { NavLink } from "react-router";
import { SplashScreenAnimation } from "../../components/SplashScreenAnimation";
import { IMAGES } from "../../constants/images"
import { AUDIO } from "../../constants/audio"
import useAudio from "../../hooks/useAudio"
import useAppInitialization from "../../hooks/useAppInitialization";

/**
 * Home component that initializes the app and displays the home page.
 * - Shows a splash screen while loading.
 * - Navigates to the "About" page using NavLink.
 */
const HomePage = () => {
  const clickSound = useAudio(AUDIO.click_sound);

  // Get isLoading status from a custom hook
  const { isLoading } = useAppInitialization();

  return (
    <div className="overflow-hidden relative h-screen w-screen flex flex-col gap-4 justify-center items-center">
      {isLoading && <SplashScreenAnimation />}

      {/* Glitches */}
      <img
        className="absolute size-16 md:size-24 lg:size-28 -z-1
           top-52   -right-2
        md:top-80 md:right-0
        lg:top-28 lg:right-16
        xl:top-28 xl:right-36"
        draggable="false"
        src={IMAGES.bg_glitch1}
        alt="Glitch Effect"
      />
      <img
        className="absolute size-16 md:size-24 lg:size-28 -z-1
           bottom-72    -left-2
        md:bottom-120 md:left-0
        lg:bottom-64 lg:left-16
        xl:bottom-64 xl:left-36"
        draggable="false"
        src={IMAGES.bg_glitch2}
        alt="Glitch Effect"
      />
      <img
        className="absolute size-16 md:size-24 lg:size-28 -z-1
           bottom-64    right-8
        md:bottom-96 md:right-20
        lg:bottom-40 lg:right-28
        xl:bottom-40 xl:right-56"
        draggable="false"
        src={IMAGES.bg_glitch3}
        alt="Glitch Effect"
      />

      {/* Main image */}
      <div className="flex flex-col relative w-screen h-auto justify-center items-center select-none px-4 py-2">
        <img
          className="h-auto max-h-128 max-w-9/10 md:max-w-9/10 xl:max-w-1/1"
          src={IMAGES.main_img}
          draggable="false"
          alt="Main Image"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row max-h-24 px-8 justify-center gap-8">
        <NavLink to="/play" className="" onClick={() => clickSound.playAudio()}>
          <img
            src={IMAGES.btn_play}
            className="max-h-24 select-none"
            draggable="false"
            alt="Play Button"
          />
        </NavLink>

        <NavLink
          to="/leaderboard"
          className=""
          onClick={() => clickSound.playAudio()}
          select-none
        >
          <img
            src={IMAGES.btn_lboard}
            className="max-h-24 select-none"
            draggable="false"
            alt="Leaderboard Button"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
