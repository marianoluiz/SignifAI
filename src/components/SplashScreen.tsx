import SplashImage from "/splash_screen.png";

const SplashScreen = () => {
  return (
    <div className="absolute bg-white flex w-screen h-screen justify-center items-center">
      <img className="animate-ltr" src={SplashImage} alt="Splash Screen" />
    </div>
  );
};

export default SplashScreen;
