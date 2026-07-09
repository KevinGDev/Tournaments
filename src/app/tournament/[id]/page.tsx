import { prisma } from "@/lib/prisma";
import { Users, Calendar, Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { TournamentActions } from "@/components/TournamentActions";
import { RoundSection } from "@/components/RoundSection";

export const dynamic = 'force-dynamic';

function getRoundLabel(round: number, totalRounds: number): string {
    if (round === totalRounds) return "Finale";
    if (round === totalRounds - 1) return "Demi-finales";
    if (round === totalRounds - 2) return "Quarts de finale";
    return `Tour ${round}`;
}

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [isUserAdmin, tournament] = await Promise.all([
        isAdmin(),
        prisma.tournament.findUnique({
            where: { id },
            include: {
                teams: { include: { players: true } },
                matches: {
                    include: { teamA: true, teamB: true },
                    orderBy: { round: 'desc' }
                }
            }
        })
    ]);

    if (!tournament) notFound();

    const allRounds = Array.from(new Set(tournament.matches.map(m => m.round))).sort((a, b) => b - a);
    const totalRounds = allRounds.length > 0 ? Math.max(...allRounds) : 0;

    const visibleRounds = allRounds.filter(r => {
        return tournament.matches.some(m =>
            m.round === r && (m.teamAId !== null || m.teamBId !== null)
        );
    });

    const finaleMatch = tournament.matches.find(m => m.round === totalRounds && m.status === 'FINISHED');
    const winnerName = finaleMatch
        ? (finaleMatch.scoreA! > finaleMatch.scoreB! ? finaleMatch.teamA?.name : finaleMatch.teamB?.name)
        : null;

    return (
        <main className="p-4 md:p-8 w-full min-h-screen">
            {isUserAdmin && (
                <div className="mb-8">
                    <TournamentActions
                        tournamentId={tournament.id}
                        teamCount={tournament.teams.length}
                    />
                </div>
            )}

            <header className="mb-12">
                <h1 className="text-5xl font-black text-text-main mb-2 uppercase italic tracking-tighter">
                    {tournament.name}
                </h1>
                <div className="flex items-center gap-2 text-steel">
                    <Calendar className="w-5 h-5" />
                    {new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </div>
            </header>

            {tournament.isFinished && winnerName && (
                <div className="mx-auto max-w-sm flex flex-col items-center justify-center py-12 bg-bg-panel/50 rounded-3xl border border-gold/30 mb-16 animate-in zoom-in duration-500 shadow-2xl shadow-gold-glow">
                    <Trophy className="w-16 h-16 text-gold mb-4 animate-pulse" />
                    <h2 className="text-sm font-bold text-steel uppercase tracking-widest">Vainqueur</h2>
                    <p className="text-3xl font-black text-gold mt-1 drop-shadow-md">{winnerName}</p>
                </div>
            )}

            <section className="mb-16">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
                    <Users className="w-5 h-5" /> Équipes ({tournament.teams.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {tournament.teams.map(team => (
                        <div key={team.id} className="bg-bg-panel/50 p-4 rounded-xl border border-steel/20">
                            <h3 className="font-bold truncate text-sm">{team.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex gap-12 items-start w-full">
                <aside className="hidden lg:block w-56 shrink-0">
                    <nav className="sticky top-8 space-y-2">
                        <h4 className="text-xs font-bold text-steel uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> Progression
                        </h4>
                        {visibleRounds.map(round => (
                            <a key={round} href={`#round-${round}`} className="block px-4 py-2 text-sm border-l-2 border-steel/10 hover:border-blood text-steel hover:text-white transition-all hover:bg-steel/5 rounded-r">
                                {getRoundLabel(round, totalRounds)}
                            </a>
                        ))}
                    </nav>
                </aside>

                <section className="grow space-y-16 w-full">
                    {visibleRounds.map(round => {
                        const activeMatches = tournament.matches
                            .filter(m => m.round === round && (m.teamAId !== null || m.teamBId !== null))
                            .sort((a, b) => a.matchOrder - b.matchOrder);

                        if (activeMatches.length === 0) return null;

                        const hasNextRoundStarted = tournament.matches.some(
                            m => m.round === round + 1 && (m.teamAId !== null || m.teamBId !== null)
                        );

                        return (
                            <RoundSection
                                key={round}
                                roundId={round}
                                isLastRound={round === totalRounds}
                                label={getRoundLabel(round, totalRounds)}
                                isUserAdmin={isUserAdmin}
                                matches={activeMatches}
                                tournamentId={tournament.id}
                                hasNextRoundStarted={hasNextRoundStarted}
                                isTournamentFinished={tournament.isFinished}
                            />
                        );
                    })}
                </section>
            </div>
        </main>
    );
}