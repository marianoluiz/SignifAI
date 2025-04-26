import { useRef } from "react"

/**
 * useAudio hook that plays music
 * - Not persistent across routes
 * - Working fine for button clicks
 */
const useAudio = (audioSrc: string) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc))
    audioRef.current.preload = "auto";
    
    const playAudio = () => {
        audioRef.current.play();
    }

    const pauseAudio = () => {
        audioRef.current.pause();
    }

    const stopAudio = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    return {
        playAudio,
        pauseAudio,
        stopAudio,
        audioRef
    }
}

export default useAudio;