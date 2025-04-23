import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { setAppInitialized, setLoading } from "../../features/app/appSlice";

import SplashScreen from "../../components/SplashScreen";
import { NavLink } from "react-router";

const Home = () => {

  const isLoading = useAppSelector((state => state.app.isLoading));
  const isAppInitialized = useAppSelector(
    (state) => state.app.isAppInitialized
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(isAppInitialized);
    /* Set SplashScreen on App's first load only */
    if (!isAppInitialized) {
      const initializeApp =() => {
        dispatch(setLoading(false));
        dispatch(setAppInitialized(true));
      }

      const timer = setTimeout(initializeApp, 2000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isAppInitialized]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <NavLink to="/about" end>
        About
      </NavLink>
    </>
  );
};

export default Home;
