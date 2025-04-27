import { useEffect } from "react";
import {
  initializeHandLandmarker,
  startWebcamAndDetect,
} from "../../../lib/handLandmarker";


/**
 * Function draw and set camera Ready
 * - Setup landmarks and  start camera
 * - sets the global state isCameraReady to True
 * - sets the global state isCameraReady to False after unmount
 */
export const useCameraSetup = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setIsCameraReady: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const setupTracker = async () => {
      await initializeHandLandmarker();

      if (videoRef.current && canvasRef.current) {
        await startWebcamAndDetect(
          videoRef as React.RefObject<HTMLVideoElement>,
          canvasRef as React.RefObject<HTMLCanvasElement>
        );

        // Wait for the video feed to load
        videoRef.current.addEventListener("loadeddata", () => {
          console.log("Camera and video feed are ready");
          setIsCameraReady(true);
        });
      }
    };

    setupTracker();

    return () => {
      
      setIsCameraReady(false);
      videoRef.current?.removeEventListener("loadeddata", () => {
        console.log("Removed loadeddata event listener");
      });
    };
  }, [setIsCameraReady]);
};
