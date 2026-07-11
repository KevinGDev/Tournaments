import { prisma } from "@/lib/prisma";
import { Users, Calendar, Zap, Trophy, Skull, Target, Meh } from "lucide-react";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { TournamentActions } from "@/components/TournamentActions";
import { RoundSection } from "@/components/RoundSection";
import { WinnerConfetti } from "@/components/WinnerConfetti";
import { RegisterModal } from "@/components/RegisterModal";
import { VictorySound } from "@/components/VictorySound";
import { getChampionTrashTalk } from "@/lib/trashtalk";

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
                matches: { include: { teamA: true, teamB: true }, orderBy: { round: 'desc' } }
            }
        })
    ]);

    if (!tournament) notFound();

    const hasMatches = tournament.matches.length > 0;
    const allRounds = Array.from(new Set(tournament.matches.map(m => m.round))).sort((a, b) => b - a);
    const totalRounds = allRounds.length > 0 ? Math.max(...allRounds) : 0;
    const visibleRounds = allRounds.filter(r => tournament.matches.some(m => m.round === r && (m.teamAId !== null || m.teamBId !== null)));

    // Calcul des statistiques
    let boucher = null, morveux = null, poissard = null;
    let winnerName = null;

    if (tournament.isFinished) {
        const finishedMatches = tournament.matches.filter(m => m.status === 'FINISHED' && m.scoreA !== null && m.scoreB !== null);
        const teamStats = tournament.teams.map(team => {
            let totalDelta = 0, totalPoints = 0;
            finishedMatches.forEach(m => {
                if (m.teamAId === team.id) {
                    totalDelta += (m.scoreA! - m.scoreB!);
                    totalPoints += m.scoreA!;
                } else if (m.teamBId === team.id) {
                    totalDelta += (m.scoreB! - m.scoreA!);
                    totalPoints += m.scoreB!;
                }
            });
            return { name: team.name, totalDelta, totalPoints };
        });

        if (teamStats.length > 0) {
            boucher = [...teamStats].sort((a, b) => b.totalDelta - a.totalDelta)[0];
            morveux = [...teamStats].sort((a, b) => a.totalPoints - b.totalPoints)[0];
            poissard = [...teamStats].sort((a, b) => a.totalDelta - b.totalDelta)[0];
        }

        const finale = tournament.matches.find(m => m.round === totalRounds && m.status === 'FINISHED');
        if (finale && finale.scoreA !== null && finale.scoreB !== null) {
            winnerName = finale.scoreA > finale.scoreB ? finale.teamA?.name : finale.teamB?.name;
        }
    }

    return (
        <main className="p-4 md:p-8 w-full min-h-screen relative">
            {tournament.isFinished && <WinnerConfetti />}

            <div className="mb-8 flex flex-wrap items-center gap-4">
                {isUserAdmin && (
                    <TournamentActions tournamentId={tournament.id} teamCount={tournament.teams.length} isFinished={tournament.isFinished} />
                )}
                {!tournament.isFinished && !hasMatches && <RegisterModal tournamentId={tournament.id} />}
            </div>

            <header className="mb-12">
                <h1 className="text-5xl font-black text-text-main mb-2 uppercase italic tracking-tighter">{tournament.name}</h1>
                <div className="flex items-center gap-2 text-steel">
                    <Calendar className="w-5 h-5" />
                    {new Date(tournament.date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' })}
                </div>
            </header>

            {tournament.isFinished && winnerName && (
                <div className="mb-16 flex flex-col items-center gap-8 px-4">
                    <div
                        id="results-card"
                        className="w-full max-w-2xl text-center p-12 md:p-16 bg-bg-panel/60 rounded-4xl border border-gold/40 transition-all duration-500"
                    >
                        <Trophy className="w-24 h-24 text-gold mx-auto mb-6 animate-pulse" />
                        <VictorySound />
                        <h2 className="text-lg text-steel uppercase tracking-widest mt-8">Grand Champion</h2>
                        <p className="text-6xl font-black text-gold mt-2">{winnerName}</p>
                        <p className="mt-6 italic text-gold/60 text-xl">"{getChampionTrashTalk()}"</p>
                    </div>
                </div>
            )}

            {tournament.isFinished && boucher && morveux && poissard && (
                <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-bg-panel/50 p-6 rounded-2xl border border-red-500/20 text-center">
                        <Skull className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <h3 className="text-red-500 font-bold uppercase text-sm">Le Boucher</h3>
                        <p className="text-xl font-bold mt-1">{boucher.name}</p>
                        <p className="text-xs text-steel">Différence : +{boucher.totalDelta}</p>
                    </div>
                    <div className="bg-bg-panel/50 p-6 rounded-2xl border border-blue-500/20 text-center">
                        <Meh className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="text-blue-500 font-bold uppercase text-sm">Le Morveux</h3>
                        <p className="text-xl font-bold mt-1">{morveux.name}</p>
                        <p className="text-xs text-steel">Points : {morveux.totalPoints}</p>
                    </div>
                    <div className="bg-bg-panel/50 p-6 rounded-2xl border border-purple-500/20 text-center">
                        <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <h3 className="text-purple-500 font-bold uppercase text-sm">Le Poissard</h3>
                        <p className="text-xl font-bold mt-1">{poissard.name}</p>
                        <p className="text-xs text-steel">Différence : {poissard.totalDelta}</p>
                    </div>
                </section>
            )}

            <section className="mb-16">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main"><Users className="w-5 h-5" /> Équipes ({tournament.teams.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {tournament.teams.map(team => (
                        <div key={team.id} className="bg-bg-panel/50 p-4 rounded-xl border border-steel/20 text-center">
                            <h3 className="font-bold text-sm truncate">{team.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex gap-12 items-start w-full">
                <aside className="hidden lg:block w-56 shrink-0">
                    <nav className="sticky top-8 space-y-2">
                        <h4 className="text-xs font-bold text-steel uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> Progression</h4>
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
                            .sort((a, b) => (a.matchOrder || 0) - (b.matchOrder || 0));

                        if (activeMatches.length === 0) return null;

                        return (
                            <RoundSection
                                key={round}
                                roundId={round}
                                isLastRound={round === totalRounds}
                                label={getRoundLabel(round, totalRounds)}
                                isUserAdmin={isUserAdmin}
                                matches={activeMatches}
                                tournamentId={tournament.id}
                                hasNextRoundStarted={tournament.matches.some(m => m.round === round + 1 && (m.teamAId !== null || m.teamBId !== null))}
                                isTournamentFinished={tournament.isFinished}
                            />
                        );
                    })}
                </section>
            </div>
        </main>
    );
}