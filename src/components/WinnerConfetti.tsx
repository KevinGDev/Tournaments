'use client'

import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useEffect, useState } from 'react'

export function WinnerConfetti() {
    const { width, height } = useWindowSize()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // On ne rend rien tant que le composant n'est pas monté côté client
    // Cela empêche React d'essayer de comparer un rendu serveur (vide)
    // avec un rendu client (avec fenêtre)
    if (!mounted) return null

    return (
        <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={800}
            gravity={0.15}
            colors={['#D4AF37', '#FFD700', '#FFFFFF', '#FF0000', '#B87333']}
        />
    )
}