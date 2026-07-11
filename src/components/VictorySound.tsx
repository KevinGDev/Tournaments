'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Volume2 } from 'lucide-react'

export function VictorySound() {
    const [isCelebrating, setIsCelebrating] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const triggerChaos = async () => {
        if (isCelebrating) return
        setIsCelebrating(true)

        // 1. Appliquer le GLOW à la carte parente (identifiée par l'ID "results-card")
        const card = document.getElementById('results-card')
        if (card) card.classList.add('animate-bro-glow')

        // 2. Audio et effets visuels
        const audio = new Audio(`/sounds/victory${Math.floor(Math.random() * 3) + 1}.mp3`)
        audioRef.current = audio
        audio.volume = 0.8
        document.body.classList.add('animate-extreme-shake')

        audio.onended = () => {
            document.body.classList.remove('animate-extreme-shake')
            card?.classList.remove('animate-bro-glow') // Fin du glow
            setIsCelebrating(false)
        }

        await audio.play()
    }

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={triggerChaos}
                disabled={isCelebrating}
                className={`
                    flex items-center gap-4 px-12 py-6 bg-gold text-black font-black uppercase text-xl rounded-full transition-all
                    ${isCelebrating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
                `}
            >
                <Zap className="w-8 h-8" />
                <span>{isCelebrating ? "MASSACRE EN COURS..." : "CELEBRER LE CARNAGE"}</span>
            </button>
        </div>
    )
}