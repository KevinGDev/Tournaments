'use client'

import { Prisma } from "@prisma/client";
import { getTrashTalk } from "@/lib/trashtalk";
import { useEffect, useState } from "react";

type MatchWithTeams = Prisma.MatchGetPayload<{ include: { teamA: true, teamB: true } }>;

export function MatchCard({
                              match,
                              isUserAdmin,
                              onScoreChange,
                              isLocked,
                              scoreA,
                              scoreB,
                              isTournamentFinished
                          }: {
    match: MatchWithTeams,
    isUserAdmin: boolean,
    onScoreChange: (a: number, b: number) => void,
    isLocked: boolean,
    scoreA: number,
    scoreB: number,
    isTournamentFinished: boolean
}) {
    // État pour le trashTalk : null au départ pour éviter l'erreur d'hydratation
    const [trashTalk, setTrashTalk] = useState<string | null>(null);

    const hasTeamA = match.teamAId !== null;
    const hasTeamB = match.teamBId !== null;
    const isComplete = hasTeamA && hasTeamB;
    const isFinished = match.status === 'FINISHED';
    const isReadOnly = isTournamentFinished || isFinished;

    useEffect(() => {
        if (isFinished && isComplete) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTrashTalk(getTrashTalk(scoreA, scoreB));
        }
    }, [isFinished, isComplete, scoreA, scoreB]);

    return (
        <div className={`bg-bg-panel p-4 rounded-xl border ${isLocked ? 'border-red-500' : 'border-steel/20'} flex flex-col gap-4 transition-all ${!isComplete ? 'opacity-50 grayscale' : ''}`}>

            <div className="flex justify-between font-bold truncate">
                <div className="flex flex-col truncate">
                    <span className="truncate">{match.teamA?.name || "???"}</span>
                </div>
                <span className="px-2 self-center">vs</span>
                <div className="flex flex-col truncate text-right">
                    <span className="truncate">{match.teamB?.name || "???"}</span>
                </div>
            </div>

            {/* Affichage du Trash Talk uniquement après montage client */}
            {trashTalk && (
                <div className="text-center">
                    <p className="text-[10px] text-gold uppercase tracking-widest font-bold italic animate-pulse">
                        &#34;{trashTalk}&#34;
                    </p>
                </div>
            )}

            {isUserAdmin && (
                <div className="flex gap-2">
                    <input
                        type="number"
                        disabled={!isComplete || isReadOnly}
                        value={scoreA}
                        onChange={(e) => onScoreChange(Number(e.target.value), scoreB)}
                        className={`w-full p-2 bg-black rounded outline-none border ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''} ${isLocked ? 'text-red-500 border-red-500' : 'border-steel/20'}`}
                    />
                    <input
                        type="number"
                        disabled={!isComplete || isReadOnly}
                        value={scoreB}
                        onChange={(e) => onScoreChange(scoreA, Number(e.target.value))}
                        className={`w-full p-2 bg-black rounded outline-none border ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''} ${isLocked ? 'text-red-500 border-red-500' : 'border-steel/20'}`}
                    />
                </div>
            )}
        </div>
    );
}