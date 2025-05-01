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
    <div>
      {isLoading && <SplashScreenAnimation />}

      <img
        className="absolute top-28 right-44 size-28 -z-1"
        draggable="false"
        src={IMAGES.bg_glitch1}
        alt="Glitch Effect"
      />
      <img
        className="absolute bottom-64 left-40 size-28 -z-1"
        draggable="false"
        src={IMAGES.bg_glitch2}
        alt="Glitch Effect"
      />
      <img
        className="absolute bottom-36 right-52 size-28 -z-1"
        draggable="false"
        src={IMAGES.bg_glitch3}
        alt="Glitch Effect"
      />

      <div className="flex flex-col justify-center items-center select-none">
        <img
          className="h-160"
          src={IMAGES.main_img}
          draggable="false"
          alt="Main Image"
        />
      </div>

      <div className="flex flex-row justify-center gap-8">


        <NavLink
          to="/play"
          className="h-24"
          onClick={() => clickSound.playAudio()}
        >
          <img
            src={IMAGES.btn_play}
            className="h-24 select-none"
            draggable="false"
            alt="Play Button"
          />
        </NavLink>

        <NavLink
          to="/leaderboard"
          className="h-16"
          onClick={() => clickSound.playAudio()}
          select-none
        >
          <img
            src={IMAGES.btn_lboard}
            className="h-24 select-none"
            draggable="false"
            alt="Leaderboard Button"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
