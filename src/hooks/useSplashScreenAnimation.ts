import { useState, useEffect } from "react";

const useSplashScreenAnimation = () => {
  const [ isSplashVisible, setIsSplashVisible ] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false)
    }, 1500);

    return () => clearTimeout(timer)
  }, []);
  
  return isSplashVisible; // state
}

export default useSplashScreenAnimation;