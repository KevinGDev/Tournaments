'use client'

import { useState } from 'react'
import TournamentCard from "@/components/TournamentCard";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation';

export default function HomeView({ tournaments, isAdmin }: { tournaments: Tournament[], isAdmin?: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter();
    const now = new Date();

    const sorted = [...tournaments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const ongoingTournaments = sorted.filter(t => !t.isFinished && new Date(t.date) <= now);
    const nextTournament = sorted.find(t => !t.isFinished && new Date(t.date) > now);
    const otherTournaments = sorted.filter(t => t.id !== nextTournament?.id && !ongoingTournaments.find(o => o.id === t.id));


    // Ajoute ce log pour vérifier que le state change VRAIMENT
    console.log("État actuel de isModalOpen:", isModalOpen);

    const handleAdminInteraction = () => {
        console.log("Appel de setIsModalOpen(true)");
        setIsModalOpen(true);
    };

    return (
        <main className="p-8 bg-transparent text-text-main min-h-screen">

            <h1 className="text-5xl font-extrabold mb-8 text-center text-glow uppercase tracking-widest">
                Tournois
            </h1>

            {/* Bouton intégré dans le flux de la page (sous le titre) */}
            <div className="flex justify-center mb-12">
                <button
                    onClick={handleAdminInteraction}
                    className="bg-transparent border border-steel/20 hover:border-blood/50 text-steel hover:text-blood px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                >
                    Administration
                </button>
            </div>

            <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="flex flex-col gap-8 mb-16 max-w-4xl mx-auto">
                {ongoingTournaments.map(t => (
                    <div key={t.id} className="border-2 border-green-500 rounded-2xl p-4 bg-green-500/10">
                        <p className="text-green-500 font-black uppercase text-center mb-2">En cours</p>
                        <TournamentCard id={t.id} name={t.name} date={new Date(t.date)} isFinished={t.isFinished} featured={true} />
                    </div>
                ))}

                {nextTournament && (
                    <div className="border-2 border-blood rounded-2xl p-4 bg-bg-panel/30">
                        <p className="text-blood font-black uppercase text-center mb-2">Prochain Tournoi</p>
                        <TournamentCard id={nextTournament.id} name={nextTournament.name} date={new Date(nextTournament.date)} isFinished={nextTournament.isFinished} featured={true} />
                    </div>
                )}
            </div>

            {otherTournaments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherTournaments.map((t) => (
                        <TournamentCard key={t.id} id={t.id} name={t.name} date={new Date(t.date)} isFinished={t.isFinished} />
                    ))}
                </div>
            )}
        </main>
    );
}