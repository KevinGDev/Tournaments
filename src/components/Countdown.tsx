'use client'
import { useState, useEffect } from 'react';

export default function Countdown({ date }: { date: Date }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = date.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("En cours / Terminé");
                clearInterval(timer);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m restants`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [date]);

    return <span className="text-blood font-mono font-bold">{timeLeft}</span>;
}