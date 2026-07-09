'use client'

import { generateBracketAction } from "@/app/actions";
import { useState } from "react";

interface TournamentActionsProps {
    tournamentId: string;
    teamCount: number;
    isFinished: boolean; // Ajout de la prop
}

export function TournamentActions({ tournamentId, teamCount, isFinished }: TournamentActionsProps) {
    const [loading, setLoading] = useState(false);

    // Si le tournoi est fini, on n'affiche absolument rien.
    if (isFinished) return null;

    return (
        <div className="flex gap-4">
            {teamCount >= 2 ? (
                <button
                    onClick={async () => {
                        setLoading(true);
                        await generateBracketAction(tournamentId);
                        setLoading(false);
                    }}
                    disabled={loading}
                    className="px-6 py-2 bg-blood text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Génération..." : "Générer les poules"}
                </button>
            ) : (
                <div className="px-6 py-2 bg-steel/10 text-steel rounded-lg italic text-sm">
                    Ajoutez au moins 2 équipes pour pouvoir générer les poules.
                </div>
            )}
        </div>
    );
}