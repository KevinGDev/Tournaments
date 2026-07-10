'use client'

import { useState, useRef } from 'react'
import { Zap, Volume2 } from 'lucide-react'

export function VictorySound() {
    const [isCelebrating, setIsCelebrating] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const triggerChaos = () => {
        if (isCelebrating) return
        setIsCelebrating(true)

        // 1. Initialisation de l'audio
        const audio = new Audio(`/sounds/victory${Math.floor(Math.random() * 3) + 1}.mp3`)
        audioRef.current = audio
        audio.volume = 0.8

        // 2. Lancement des effets visuels
        document.body.classList.add('animate-extreme-shake')
        const trophy = document.querySelector('#results svg') as HTMLElement
        if (trophy) {
            trophy.style.display = 'inline-block'
            trophy.style.transformOrigin = 'center'
            trophy.classList.add('animate-grow-giant')
        }

        // 3. Gestion de la fin de lecture
        audio.onended = () => {
            document.body.classList.remove('animate-extreme-shake')
            if (trophy) {
                trophy.classList.remove('animate-grow-giant')
                trophy.style.display = ''
                trophy.style.transform = ''
            }
            setIsCelebrating(false)
        }

        // 4. Lecture
        audio.play().catch((e) => {
            console.error(e)
            setIsCelebrating(false) // Si erreur, on débloque le bouton
        })
    }

    return (
        <div className="my-12 flex flex-col items-center">
            {isCelebrating && (
                <div className="fixed inset-0 z-9999 pointer-events-none animate-color-glitch mix-blend-multiply" />
            )}

            <button
                onClick={triggerChaos}
                disabled={isCelebrating}
                className={`
                    relative z-10000 flex items-center gap-4 px-12 py-6 
                    bg-gold text-black font-black uppercase text-xl
                    rounded-full transition-all duration-300
                    ${isCelebrating
                    ? 'opacity-30 cursor-not-allowed grayscale'
                    : 'hover:scale-110 hover:shadow-[0_0_60px_rgba(255,215,0,0.6)] animate-bounce active:scale-95'}
                `}
            >
                {isCelebrating ? (
                    <>
                        <Volume2 className="w-8 h-8 animate-spin" />
                        <span>MASSACRE EN COURS...</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-8 h-8" />
                        <span>CELEBRER LE CARNAGE</span>
                    </>
                )}
            </button>
        </div>
    )
}