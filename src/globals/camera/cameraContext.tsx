import { createContext, useRef, useContext, ReactNode, useState,  } from "react";

type CameraContextType = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraReady: boolean;
  setIsCameraReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider = ({ children }: { children: ReactNode}) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  return (
    <>
      <CameraContext.Provider
        value={{ videoRef, canvasRef, isCameraReady, setIsCameraReady }}
      >
        {children}
      </CameraContext.Provider>
    </>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}