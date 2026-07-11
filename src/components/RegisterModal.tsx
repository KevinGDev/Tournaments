"use client";
import { useState } from "react";
import { registerTeamAction } from "@/app/actions";

export function RegisterModal({ tournamentId }: { tournamentId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blood text-black font-bold py-1 px-4 text-sm rounded-lg hover:bg-gold/80 transition-all"
            >
                Inscrire une équipe
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-bg-panel p-6 rounded-2xl border border-blood/20 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-blood">Inscrire une équipe</h3>
                        <form action={async (formData) => {
                            await registerTeamAction(formData);
                            setIsOpen(false);
                        }} className="flex flex-col gap-3">
                            <input type="hidden" name="tournamentId" value={tournamentId} />
                            <input name="teamName" placeholder="Nom de l'équipe" required className="p-2 bg-black/20 border border-steel/20 rounded-lg text-white" />
                            <input name="players" placeholder="Joueurs (ex: Alice, Bob)" required className="p-2 bg-black/20 border border-steel/20 rounded-lg text-white" />
                            <div className="flex gap-2 mt-2">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-1 text-sm text-steel hover:text-white">Annuler</button>
                                <button type="submit" className="flex-1 bg-blood text-black font-bold py-1 text-sm rounded-lg hover:bg-gold/80">Valider</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}