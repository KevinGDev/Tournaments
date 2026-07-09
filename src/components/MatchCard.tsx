'use client'

import { Prisma } from "@prisma/client";

type MatchWithTeams = Prisma.MatchGetPayload<{ include: { teamA: true, teamB: true } }>;

export function MatchCard({ match, isUserAdmin, onScoreChange, isLocked, scoreA, scoreB }: {
    match: MatchWithTeams,
    isUserAdmin: boolean,
    onScoreChange: (a: number, b: number) => void,
    isLocked: boolean,
    scoreA: number,
    scoreB: number
}) {
    // Vérification des équipes
    const hasTeamA = match.teamAId !== null;
    const hasTeamB = match.teamBId !== null;
    const isComplete = hasTeamA && hasTeamB;

    return (
        // Si !isComplete, on applique opacity-50 et grayscale pour griser la carte
        <div className={`bg-bg-panel p-4 rounded-xl border ${isLocked ? 'border-red-500' : 'border-steel/20'} flex flex-col gap-4 transition-all ${!isComplete ? 'opacity-50 grayscale' : ''}`}>

            <div className="flex justify-between font-bold truncate">
                <div className="flex flex-col truncate">
                    <span className="truncate">{match.teamA?.name || "???"}</span>
                    {hasTeamA && !hasTeamB && <span className="text-[10px] text-green-500 uppercase">Qualifié (Bye)</span>}
                </div>

                <span className="px-2 self-center">vs</span>

                <div className="flex flex-col truncate text-right">
                    <span className="truncate">{match.teamB?.name || "???"}</span>
                    {hasTeamB && !hasTeamA && <span className="text-[10px] text-green-500 uppercase">Qualifié (Bye)</span>}
                </div>
            </div>

            {isUserAdmin && (
                <div className="flex gap-2">
                    <input
                        type="number"
                        disabled={!isComplete}
                        value={scoreA}
                        onChange={(e) => onScoreChange(Number(e.target.value), scoreB)}
                        className={`w-full p-2 bg-black rounded outline-none border ${isLocked ? 'text-red-500 border-red-500' : 'border-steel/20'}`}
                    />
                    <input
                        type="number"
                        disabled={!isComplete}
                        value={scoreB}
                        onChange={(e) => onScoreChange(scoreA, Number(e.target.value))}
                        className={`w-full p-2 bg-black rounded outline-none border ${isLocked ? 'text-red-500 border-red-500' : 'border-steel/20'}`}
                    />
                </div>
            )}

            {isLocked && <p className="text-red-500 text-xs text-center uppercase font-bold">Égalité interdite</p>}
            {!isComplete && <p className="text-steel text-xs text-center uppercase">Match incomplet</p>}
        </div>
    );
}