'use client'

import { useState } from 'react'
import TournamentCard from "@/components/TournamentCard";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Tournament } from '@prisma/client'

export default function HomeView({ tournaments }: { tournaments: Tournament[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 1. On trie tous les tournois par date
    const sortedTournaments = [...tournaments].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 2. On identifie le prochain tournoi (le plus proche dans le futur)
    const now = new Date();
    const nextTournament = sortedTournaments.find(t => new Date(t.date) > now);

    // 3. On récupère tous les autres (passés ou futurs sauf le next)
    const otherTournaments = sortedTournaments.filter(t => t.id !== nextTournament?.id);

    return (
        <main className="p-8 bg-transparent text-text-main relative transition-colors duration-300">
            {/* Zone invisible au bord gauche */}
            <div
                className="fixed top-0 left-0 h-full w-4 cursor-pointer z-40 hover:bg-blood/20 transition-colors"
                onClick={() => setIsModalOpen(true)}
                title="Accès Turbo Mega Manager"
            />

            {/* Modale de connexion */}
            <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <h1 className="text-5xl font-extrabold mb-12 text-center text-glow uppercase tracking-widest drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                Tournois
            </h1>

            {/* TOURNOI À LA UNE (Prochain) */}
            {nextTournament && (
                <div className="mb-16 border-2 border-blood rounded-2xl p-4 bg-bg-panel/30 shadow-[0_0_40px_rgba(185,28,28,0.2)] w-full max-w-4xl mx-auto">
                    <div className="bg-blood/10 py-2 rounded-t-lg mb-2">
                        <p className="text-blood font-black uppercase tracking-[0.3em] text-xs text-center">
                            Prochain Tournoi
                        </p>
                    </div>
                    <TournamentCard
                        featured={true}
                        id={nextTournament.id}
                        name={nextTournament.name}
                        date={new Date(nextTournament.date)}
                    />
                </div>
            )}

            {/* TOUS LES AUTRES (Incluant ceux en cours ou terminés) */}
            {otherTournaments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherTournaments.map((t) => (
                        <TournamentCard
                            key={t.id}
                            id={t.id}
                            name={t.name}
                            date={new Date(t.date)}
                            isFinished={t.isFinished}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}