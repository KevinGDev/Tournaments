'use client'

import { useState, useRef } from 'react'
import { Play, Volume2 } from 'lucide-react'

export function VictorySound() {
    const [hasPlayed, setHasPlayed] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    // On utilise une ref pour garder une trace de l'instance audio en cours
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const playVictory = () => {
        // Si un son est déjà en train de jouer, on empêche l'action
        if (isPlaying) return

        const audioFiles = [
            '/sounds/victory1.mp3',
            '/sounds/victory2.mp3',
            '/sounds/victory3.mp3'
        ];

        const randomIndex = Math.floor(Math.random() * audioFiles.length);
        const audio = new Audio(audioFiles[randomIndex]);

        audioRef.current = audio;
        audio.volume = 0.6;

        // Gestion des états
        setIsPlaying(true);
        setHasPlayed(true);

        audio.play().catch(e => {
            console.error("Erreur lecture son :", e);
            setIsPlaying(false);
        });

        // Quand le son se termine, on réactive le bouton
        audio.onended = () => {
            setIsPlaying(false);
        };
    };

    return (
        <div className="my-8">
            <button
                onClick={playVictory}
                // On désactive visuellement le bouton si isPlaying est vrai
                disabled={isPlaying}
                className={`
                    relative flex items-center gap-3 px-8 py-4 
                    bg-gold text-black font-black uppercase tracking-[0.2em] 
                    rounded-full transition-all duration-300
                    hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]
                    ${hasPlayed ? 'opacity-70 scale-95' : 'animate-bounce shadow-[0_0_20px_rgba(212,175,55,0.4)]'}
                    ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}
                `}
            >
                {isPlaying ? (
                    <>
                        <Volume2 className="w-5 h-5 animate-pulse" />
                        <span>CARNAGE EN COURS...</span>
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 fill-black" />
                        <span>{hasPlayed ? 'RE-CELEBRER LE MASSACRE' : 'CELEBRER LE MASSACRE'}</span>
                    </>
                )}

                {!hasPlayed && !isPlaying && (
                    <span className="absolute -inset-1 rounded-full border-2 border-gold/30 animate-ping" />
                )}
            </button>
        </div>
    )
}