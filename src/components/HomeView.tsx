'use client'

import { useState } from 'react'
import TournamentCard from "@/components/TournamentCard";
import AdminLoginModal from "@/components/AdminLoginModal";
import ThemeToggle from "@/components/Themetoggle";
import { Tournament } from '@prisma/client'

export default function HomeView({ tournaments }: { tournaments: Tournament[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tournaments.map((t) => (
                    // Ajout de la prop id={t.id}
                    <TournamentCard key={t.id} id={t.id} name={t.name} />
                ))}
                {tournaments.length === 0 && (
                    <div className="col-span-3 text-center border-t border-b border-blood py-12">
                        <p className="text-steel uppercase tracking-widest">
                            Aucun tournoi actif.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}