import { useEffect } from "react"
import { stopWebcam } from "../../../utils/handLandmarkerHelper";

/**
 *  Cleanup Function
 *  - off camera if back is pressed
 */
export const useCleanup = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  useEffect(() => {
    return () => {
      console.log("Ending Camera...")
      
      if (videoRef)
        stopWebcam(videoRef);
    }
  }, []);
};
