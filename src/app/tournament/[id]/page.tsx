import { prisma } from "@/lib/prisma";
import { Users, Calendar, Trophy, Skull, Target, Zap, Meh } from "lucide-react";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { TournamentActions } from "@/components/TournamentActions";
import { RoundSection } from "@/components/RoundSection";
import { WinnerConfetti } from "@/components/WinnerConfetti";
import {getChampionTrashTalk} from "@/lib/trashtalk";
import {VictorySound} from "@/components/VictorySound";

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

    let boucher = null, morveux = null, poissard = null;

    if (tournament.isFinished) {
        const finishedMatches = tournament.matches.filter(m => m.status === 'FINISHED');
        const teamStats = tournament.teams.map(team => {
            let totalDelta = 0;
            let totalPoints = 0;
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
    }

    const allRounds = Array.from(new Set(tournament.matches.map(m => m.round))).sort((a, b) => b - a);
    const totalRounds = allRounds.length > 0 ? Math.max(...allRounds) : 0;
    const visibleRounds = allRounds.filter(r => tournament.matches.some(m => m.round === r && (m.teamAId !== null || m.teamBId !== null)));

    const finaleMatch = tournament.matches.find(m => m.round === totalRounds && m.status === 'FINISHED');
    const winnerName = finaleMatch ? (finaleMatch.scoreA! > finaleMatch.scoreB! ? finaleMatch.teamA?.name : finaleMatch.teamB?.name) : null;

    return (
        <main className="p-4 md:p-8 w-full min-h-screen relative">
            {tournament.isFinished && (
                <>
                    <WinnerConfetti />

                </>
            )}
            {isUserAdmin && (
                <div className="mb-8">
                    <TournamentActions
                        tournamentId={tournament.id}
                        teamCount={tournament.teams.length}
                        isFinished={tournament.isFinished}
                    />
                </div>
            )}

            <header className="mb-12">
                <h1 className="text-5xl font-black text-text-main mb-2 uppercase italic tracking-tighter">{tournament.name}</h1>
                <div className="flex items-center gap-2 text-steel"><Calendar className="w-5 h-5" />{new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</div>
            </header>

            {/* ID results ajouté ici pour l'ancre de scroll automatique */}
            {tournament.isFinished && winnerName && boucher && morveux && poissard && (
                <div id="results" className="flex flex-col gap-8 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="mx-auto w-full max-w-lg flex flex-col items-center justify-center py-16 px-8 bg-bg-panel/60 rounded-[2rem] border border-gold/40 shadow-2xl shadow-gold-glow/20 backdrop-blur-sm">
                        <Trophy className="w-24 h-24 text-gold mb-6 animate-pulse" />
                        {/* Le bouton apparaît seulement si c'est fini */}
                        <VictorySound />
                        <h2 className="text-xs font-bold text-steel uppercase tracking-[0.2em]">Grand Champion</h2>
                        <p className="text-5xl font-black text-gold mt-2 uppercase tracking-tighter drop-shadow-lg">{winnerName}</p>
                        <p className="mt-4 text-xs font-bold text-gold/60 italic uppercase tracking-wider">
                            &#34;{getChampionTrashTalk()}&#34;
                            {/* Le bouton apparaît seulement si c'est fini */}
                        </p>

                        <div className="mt-6 w-16 h-1 bg-gold/50 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
                        <div className="bg-bg-panel/50 p-6 rounded-2xl border border-blood/50 flex items-center gap-4">
                            <Target className="w-10 h-10 text-blood" />
                            <div>
                                <h4 className="text-[10px] font-bold text-blood uppercase tracking-wider">Le Boucher</h4>
                                <p className="text-sm font-bold text-white">{boucher.name}</p>
                                <p className="text-[10px] text-steel">+{boucher.totalDelta} pts d&#39;écart</p>
                            </div>
                        </div>
                        <div className="bg-bg-panel/50 p-6 rounded-2xl border-2 border-steel/20 flex items-center gap-4">
                            <Skull className="w-10 h-10 text-steel" />
                            <div>
                                <h4 className="text-[10px] font-bold text-steel uppercase tracking-wider">Le Morveux</h4>
                                <p className="text-sm font-bold text-white">{morveux.name}</p>
                                <p className="text-[10px] text-steel">{morveux.totalPoints} pts marqués</p>
                            </div>
                        </div>
                        <div className="bg-bg-panel/50 p-6 rounded-2xl border border-purple-500/30 flex items-center gap-4">
                            <Meh className="w-10 h-10 text-purple-500" />
                            <div>
                                <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Le Poissard</h4>
                                <p className="text-sm font-bold text-white">{poissard.name}</p>
                                <p className="text-[10px] text-steel">{poissard.totalDelta} pts de karma</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mb-16">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main"><Users className="w-5 h-5" /> Équipes ({tournament.teams.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {tournament.teams.map(team => (
                        <div key={team.id} className="bg-bg-panel/50 p-4 rounded-xl border border-steel/20"><h3 className="font-bold truncate text-sm">{team.name}</h3></div>
                    ))}
                </div>
            </section>

            <div className="flex gap-12 items-start w-full">
                <aside className="hidden lg:block w-56 shrink-0">
                    <nav className="sticky top-8 space-y-2">
                        <h4 className="text-xs font-bold text-steel uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> Progression</h4>
                        {visibleRounds.map(round => (
                            <a key={round} href={`#round-${round}`} className="block px-4 py-2 text-sm border-l-2 border-steel/10 hover:border-blood text-steel hover:text-white transition-all hover:bg-steel/5 rounded-r">{getRoundLabel(round, totalRounds)}</a>
                        ))}
                    </nav>
                </aside>

                <section className="grow space-y-16 w-full">
                    {visibleRounds.map(round => {
                        const activeMatches = tournament.matches.filter(m => m.round === round && (m.teamAId !== null || m.teamBId !== null)).sort((a, b) => a.matchOrder - b.matchOrder);
                        if (activeMatches.length === 0) return null;
                        const hasNextRoundStarted = tournament.matches.some(m => m.round === round + 1 && (m.teamAId !== null || m.teamBId !== null));
                        return (
                            <RoundSection key={round} roundId={round} isLastRound={round === totalRounds} label={getRoundLabel(round, totalRounds)} isUserAdmin={isUserAdmin} matches={activeMatches} tournamentId={tournament.id} hasNextRoundStarted={hasNextRoundStarted} isTournamentFinished={tournament.isFinished} />
                        );
                    })}
                </section>
            </div>
        </main>
    );
}