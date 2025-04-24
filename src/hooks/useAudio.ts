import { useRef } from "react"

const useAudio = (audioSrc: string) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc))
    audioRef.current.preload = "auto";
    
    const playAudio = () => {
        audioRef.current.play();
    }

    const pauseAudio = () => {
        audioRef.current.pause();
    }

    return {
        playAudio,
        pauseAudio,
        audioRef
    }
}

export default useAudio;