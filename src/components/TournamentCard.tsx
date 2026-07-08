'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CardProps {
    id: string;
    name: string;
    date: Date;
    isFinished: boolean; // Utilisation du booléen
    featured?: boolean;
}

export default function TournamentCard({ id, name, date, isFinished, featured }: CardProps) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    useEffect(() => {
        // Si c'est fini, on sort immédiatement
        if (isFinished) return;

        const updateTimer = () => {
            const now = new Date();
            const diff = date.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("EN COURS");
                setIsUrgent(true);
            } else {
                setIsUrgent(diff < 3600000);
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [date, isFinished]); // isFinished ici est important

    const getStatusContent = () => {
        // PRIORITÉ ABSOLUE : Si c'est fini, on affiche TERMINÉ, point final.
        if (isFinished) return { text: "TERMINÉ", style: "text-gray-500 border-gray-500/30" };

        // Ensuite on regarde si c'est en cours (date passée)
        if (timeLeft === "EN COURS") return { text: "EN COURS", style: "text-green-500 border-green-500/30" };

        // Sinon le timer
        if (isUrgent) return { text: timeLeft, style: "text-red-500 animate-pulse border-red-500/50" };
        return { text: timeLeft, style: "text-blood border-blood/30" };
    };

    const status = getStatusContent();

    return (
        <Link href={`/tournament/${id}`} className="block transition-transform hover:scale-[1.02]">
            <div className={`p-8 rounded-2xl bg-bg-panel transition-all flex flex-col items-center text-center
                ${featured ? 'border-0 bg-bg-panel/50' : 'border-2 border-steel/20 hover:border-blood'}`}>

                <h3 className="text-3xl md:text-4xl font-black text-text-main mb-4 tracking-tight uppercase">
                    {name}
                </h3>

                <p className="text-lg text-steel font-medium mb-6">
                    {date.toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    }).replace(/^\w/, (c) => c.toUpperCase())}
                </p>

                <div className={`text-5xl md:text-6xl font-mono font-black tracking-[0.2em] w-full py-6 rounded-xl bg-bg-dark/50 border-2 transition-colors duration-500 ${status.style}`}>
                    {status.text}
                </div>
            </div>
        </Link>
    );
}