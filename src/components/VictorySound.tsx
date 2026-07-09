'use client'

import { useState } from 'react'
import { Play, Volume2 } from 'lucide-react'

export function VictorySound() {
    const [hasPlayed, setHasPlayed] = useState(false)

    const playVictory = () => {
        const audio = new Audio('/sounds/victory.mp3')
        audio.volume = 0.6
        audio.play().catch(e => console.error("Erreur lecture son :", e))
        setHasPlayed(true)
    }

    return (
        // La marge my-8 ajoute de l'espace au-dessus et en-dessous
        <div className="my-8">
            <button
                onClick={playVictory}
                className={`
                    relative flex items-center gap-3 px-8 py-4 
                    bg-gold text-black font-black uppercase tracking-[0.2em] 
                    rounded-full transition-all duration-300
                    hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]
                    ${hasPlayed ? 'opacity-70 scale-95' : 'animate-bounce shadow-[0_0_20px_rgba(212,175,55,0.4)]'}
                `}
            >
                {hasPlayed ? (
                    <>
                        <Volume2 className="w-5 h-5" />
                        <span>CARNAGE EN COURS</span>
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 fill-black" />
                        <span>CELEBRER LE MASSACRE</span>
                    </>
                )}

                {!hasPlayed && (
                    <span className="absolute -inset-1 rounded-full border-2 border-gold/30 animate-ping" />
                )}
            </button>
        </div>
    )
}