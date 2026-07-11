'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { MatchCard } from "@/components/MatchCard";
import { Prisma } from "@prisma/client";
import { completeRoundAction, finishTournament } from "@/app/actions";
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
    isFFA?: boolean;
    teams?: { id: string; name: string }[];
}

export function RoundSection({
                                 label,
                                 roundId,
                                 matches,
                                 isUserAdmin,
                                 tournamentId,
                                 isLastRound,
                                 isTournamentFinished,
                                 isFFA = false,
                                 teams = []
                             }: RoundSectionProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [winnerId, setWinnerId] = useState<string | null>(null);

    const [scores, setScores] = useState<MatchScore[]>(
        matches.map(m => ({ matchId: m.id, scoreA: m.scoreA || 0, scoreB: m.scoreB || 0 }))
    );

    const handleScoreChange = (matchId: string, sA: number, sB: number) => {
        setScores(prev => prev.map(s => s.matchId === matchId ? { ...s, scoreA: sA, scoreB: sB } : s));
    };

    return (
        <div id={`round-${roundId}`} className="scroll-mt-8">
            <button
                onClick={() => !isFFA && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between text-2xl font-black uppercase text-glow mb-8 pb-4 border-b border-steel/20 ${isFFA ? 'cursor-default' : ''}`}
            >
                {label}
                {!isFFA && (isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />)}
            </button>

            {(isOpen || isFFA) && (
                <div className="space-y-8">
                    {isFFA ? (
                        <div className="bg-bg-panel/20 p-6 rounded-2xl border border-steel/10">
                            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-text-main">Désigner le vainqueur</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {teams.map(team => (
                                    <button
                                        key={team.id}
                                        onClick={() => setWinnerId(team.id)}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${winnerId === team.id ? 'border-gold bg-gold/10' : 'border-steel/20 bg-bg-dark hover:border-steel'}`}
                                    >
                                        <Trophy className={winnerId === team.id ? 'text-gold' : 'text-steel'} />
                                        <span className="font-bold text-sm">{team.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {matches.map(match => (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    isUserAdmin={isUserAdmin}
                                    scoreA={scores.find(s => s.matchId === match.id)?.scoreA ?? 0}
                                    scoreB={scores.find(s => s.matchId === match.id)?.scoreB ?? 0}
                                    onScoreChange={(sA, sB) => handleScoreChange(match.id, sA, sB)}
                                    isTournamentFinished={isTournamentFinished}
                                />
                            ))}
                        </div>
                    )}

                    {isUserAdmin && !isTournamentFinished && (
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    if (isFFA) {
                                        // On passe bien winnerId ici
                                        if (winnerId) {
                                            await finishTournament(tournamentId, winnerId);
                                        } else {
                                            alert("Veuillez sélectionner un vainqueur");
                                        }
                                    } else {
                                        await completeRoundAction(tournamentId, roundId, scores);
                                    }
                                } catch (e) {
                                    alert("Erreur lors de la validation");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading || (isFFA && !winnerId)}
                            className="w-full bg-blood hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase disabled:opacity-50 transition-all"
                        >
                            {loading ? "Chargement..." : isFFA ? "Couronner le vainqueur" : `Valider ${label}`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}