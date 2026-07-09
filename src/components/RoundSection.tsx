'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MatchCard } from "@/components/MatchCard";
import { Prisma } from "@prisma/client";
import { completeRoundAction } from "@/app/actions";
import { MatchScore } from "@/app/types/tournament";

type MatchWithTeams = Prisma.MatchGetPayload<{ include: { teamA: true, teamB: true } }>;

interface RoundSectionProps {
    label: string;
    roundId: number;
    matches: MatchWithTeams[];
    isUserAdmin: boolean;
    tournamentId: string;
    hasNextRoundStarted: boolean;
    isLastRound: boolean;
    isTournamentFinished: boolean;
}

export function RoundSection({
                                 label, roundId, matches, isUserAdmin, tournamentId, hasNextRoundStarted, isLastRound, isTournamentFinished,
                             }: RoundSectionProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const [scores, setScores] = useState<MatchScore[]>(
        matches.map(m => ({ matchId: m.id, scoreA: m.scoreA || 0, scoreB: m.scoreB || 0 }))
    );

    const handleScoreChange = (matchId: string, sA: number, sB: number) => {
        setScores(prev => prev.map(s => s.matchId === matchId ? { ...s, scoreA: sA, scoreB: sB } : s));
    };

    // LOGIQUE DE VALIDATION :
    // 1. Un match est complet s'il a deux équipes.
    // 2. Un match complet doit avoir un score joué (différent de 0-0) et non égal.
    const hasDrawOrInvalid = matches.some(match => {
        const isComplete = match.teamAId !== null && match.teamBId !== null;
        if (!isComplete) return false; // Les Byes ne bloquent pas

        const score = scores.find(s => s.matchId === match.id);
        if (!score) return false;

        // Bloque si 0-0 (non joué) OU si égalité
        return score.scoreA === score.scoreB;
    });

    return (
        <div id={`round-${roundId}`} className="scroll-mt-8">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-2xl font-black uppercase text-glow mb-8 pb-4 border-b border-steel/20">
                {label}
                {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matches.map(match => {
                            const isComplete = match.teamAId !== null && match.teamBId !== null;
                            const score = scores.find(s => s.matchId === match.id);

                            // On verrouille visuellement si égalité (et que ce n'est pas un Bye)
                            const isLocked = isComplete && score ? score.scoreA === score.scoreB : false;

                            return (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    isUserAdmin={isUserAdmin}
                                    isLocked={isLocked}
                                    scoreA={score?.scoreA ?? 0}
                                    scoreB={score?.scoreB ?? 0}
                                    onScoreChange={(sA, sB) => handleScoreChange(match.id, sA, sB)}
                                    isTournamentFinished={false}                                />
                            );
                        })}
                    </div>

                    {isUserAdmin && !hasNextRoundStarted && !isTournamentFinished && (
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try { await completeRoundAction(tournamentId, roundId, scores); }
                                catch (e) { alert("Erreur : " + e); }
                                finally { setLoading(false); }
                            }}
                            disabled={loading || hasDrawOrInvalid}
                            className={`w-full mt-4 font-black py-4 rounded-xl uppercase transition-all ${
                                loading || hasDrawOrInvalid
                                    ? "bg-steel/50 cursor-not-allowed text-white/50"
                                    : "bg-blood hover:bg-red-700 text-white"
                            }`}
                        >
                            {loading ? "Validation..." : hasDrawOrInvalid ? "Scores invalides (0-0 ou égalité)" : `Valider ${label}`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}