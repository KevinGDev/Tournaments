'use client'

import { useState, useEffect } from 'react';
import { generateBracketAction } from '@/app/actions';

interface CountdownProps {
    date: Date;
    isFinished: boolean;
    tournamentId: string;
}

export default function Countdown({ date, isFinished, tournamentId }: CountdownProps) {
    // On normalise la date reçue en ajoutant le décalage local pour compenser le stockage en "heure locale"
    const offset = new Date().getTimezoneOffset() * 60000;
    const targetTimestamp = date.getTime() + offset;

    const [currentTime, setCurrentTime] = useState(Date.now());
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        if (isFinished) return;

        const interval = setInterval(async () => {
            const now = Date.now();
            setCurrentTime(now);

            // Comparaison avec le timestamp normalisé
            if (targetTimestamp - now <= 0 && !hasTriggered) {
                setHasTriggered(true);
                await generateBracketAction(tournamentId);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [targetTimestamp, isFinished, tournamentId, hasTriggered]);

    const diff = targetTimestamp - currentTime;

    const getDisplayText = () => {
        if (isFinished) return "TERMINÉ";
        if (diff <= 0) return "EN COURS";

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const ms = Math.floor((diff % 1000) / 10);

        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        const displayStr = d > 0 ? `${d}j ${timeStr}` : timeStr;

        if (d === 0 && h === 0 && m === 0) {
            return `${displayStr}.${String(ms).padStart(2, '0')}`;
        }

        return displayStr;
    };

    const displayText = getDisplayText();

    const getStyle = () => {
        if (isFinished || displayText === "TERMINÉ") return "text-gray-500 border-gray-500/30";
        if (displayText === "EN COURS") return "text-green-500 border-green-500/30 animate-pulse";
        if (!displayText.includes('j') && displayText.startsWith("00:")) {
            return "text-red-500 animate-pulse border-red-500/50";
        }
        return "text-steel border-steel/30";
    };

    return (
        <div className={`text-5xl md:text-6xl font-mono font-black tracking-[0.2em] w-full py-6 rounded-xl bg-bg-dark/50 border-2 transition-colors duration-500 ${getStyle()}`}>
            {displayText}
        </div>
    );
}