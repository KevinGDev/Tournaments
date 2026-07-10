'use client'

import { useTransition } from 'react';
import { finishTournament } from "@/app/actions";
import { Trophy } from "lucide-react";

export default function FinishTournamentButton({ tournamentId }: { tournamentId: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            disabled={isPending}
            onClick={() => startTransition(async () => {
                await finishTournament(tournamentId);
            })}
            className="flex items-center gap-1 px-3 py-1 bg-green-900/20 border border-green-500/30 text-green-500 rounded text-xs font-bold hover:bg-green-900/40 transition-all cursor-pointer disabled:opacity-50"
        >
            <Trophy className="w-3 h-3" /> {isPending ? "Traitement..." : "Terminer"}
        </button>
    );
}