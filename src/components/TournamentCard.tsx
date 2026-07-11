'use client'

import Link from 'next/link';
import Countdown from './Countdown';

interface CardProps {
    id: string;
    name: string;
    date: Date;
    isFinished: boolean;
    featured?: boolean;
}

export default function TournamentCard({ id, name, date, isFinished, featured }: CardProps) {
    return (
        <Link href={`/tournament/${id}`} className="block transition-transform hover:scale-[1.02]">
            <div className={`p-8 rounded-2xl bg-bg-panel transition-all flex flex-col items-center text-center
                ${featured ? 'border-0 bg-bg-panel/50' : 'border-2 border-steel/20 hover:border-blood'}`}>

                <h3 className="text-3xl md:text-4xl font-black text-text-main mb-4 tracking-tight uppercase">
                    {name}
                </h3>

                <p className="text-lg text-steel font-medium mb-6">
                    {date.toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' // Force l'affichage en UTC
                    }).replace(/^\w/, (c) => c.toUpperCase())}
                </p>

                <Countdown date={date} isFinished={isFinished} tournamentId={id} />

            </div>
        </Link>
    );
}