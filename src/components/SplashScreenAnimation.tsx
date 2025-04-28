import SplashImage from "/splash_screen.png";

export const SplashScreenAnimation = () => {
  return (
    <div className="absolute z-100 bg-white flex w-screen h-screen justify-center items-center">
      <img className="animate-ltr" src={SplashImage} alt="Splash Screen" />
    </div>
  );
};
