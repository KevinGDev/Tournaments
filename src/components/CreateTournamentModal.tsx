'use client'
import { useState } from 'react';
import { createTournament } from "@/app/actions";

export default function CreateTournamentModal() {
    const [isOpen, setIsOpen] = useState(false);

    const getNowISO = () => {
        const now = new Date();
        // On retire juste les millisecondes et on prend la chaîne locale formatée
        return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-full bg-blood hover:bg-glow text-white font-bold py-4 rounded-xl transition-all">
                + Nouveau Tournoi
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm">
                    <div className="bg-bg-panel border border-steel/30 p-8 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold text-text-main mb-6">Créer un tournoi</h2>
                        <form
                            action={async (fd) => {
                                await createTournament(fd);
                                setIsOpen(false);
                            }}
                            className="space-y-4"
                        >
                            <input name="name" placeholder="Nom" className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-text-main" required />

                            <input
                                type="datetime-local"
                                name="date"
                                defaultValue={getNowISO()}
                                className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-steel"
                                required
                            />

                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-steel border border-steel/20 rounded">Annuler</button>
                                <button type="submit" className="flex-1 bg-blood text-white font-bold py-2 rounded">Créer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}