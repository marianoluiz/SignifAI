import { useEffect } from "react";
import { NavLink } from "react-router";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setAppInitialized, setLoading } from "../../features/app/appSlice";

import SplashScreen from "../../components/SplashScreen";
import { IMAGES } from "../../constants/images"
import { AUDIO } from "../../constants/audio"
import useAudio from "../../hooks/useAudio"

/**
 * Home component that initializes the app and displays the home page.
 * - Shows a splash screen while loading.
 * - Navigates to the "About" page using NavLink.
 */
const HomePage = () => {
  const clickSound = useAudio(AUDIO.click_sound);

  // Redux state selectors
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const isAppInitialized = useAppSelector(
    (state) => state.app.isAppInitialized
  );

  // Redux dispatcher
  const dispatch = useAppDispatch();

  // Initialize the app on first load only
  useEffect(() => {
    if (!isAppInitialized) {
      const initializeApp = () => {
        dispatch(setLoading(false));
        dispatch(setAppInitialized(true));
      };

      const timer = setTimeout(initializeApp, 1500);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isAppInitialized]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div>
      <img
        className="absolute top-28 right-44 size-28 -z-1"
        src={IMAGES.bg_glitch1}
        alt="Glitch Effect"
      />
      <img
        className="absolute bottom-64 left-40 size-28 -z-1"
        src={IMAGES.bg_glitch2}
        alt="Glitch Effect"
      />
      <img
        className="absolute bottom-36 right-52 size-28 -z-1"
        src={IMAGES.bg_glitch3}
        alt="Glitch Effect"
      />

      <div className="flex flex-col justify-center items-center">
        <img className="h-160" src={IMAGES.main_img} alt="Main Image" />
      </div>

      <div className="flex flex-row justify-center gap-8">
        <NavLink
          to="/practice"
          className="h-16"
          onClick={() => clickSound.playAudio()}
        >
          <img src={IMAGES.btn_pract} className="h-16" alt="Practice Button" />
        </NavLink>

        <NavLink
          to="/play"
          className="h-24"
          onClick={() => clickSound.playAudio()}
        >
          <img src={IMAGES.btn_play} className="h-24" alt="Play Button" />
        </NavLink>

        <NavLink
          to="/leaderboard"
          className="h-16"
          onClick={() => clickSound.playAudio()}
        >
          <img
            src={IMAGES.btn_lboard}
            className="h-16"
            alt="Leaderboard Button"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
