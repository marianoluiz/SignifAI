import { useRef } from "react"

/**
 * useAudio hook that plays music
 * - expected to be not persistent across routes but seems to be persistent
 * - had to create state for turning music off and on
 * - Working fine for button clicks and music
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