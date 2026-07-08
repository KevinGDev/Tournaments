import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. On attend la résolution des params
    const resolvedParams = await params;
    const tournamentId = resolvedParams.id;

    // 2. On utilise l'ID récupéré
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
            teams: {
                include: { players: true }
            }
        }
    });

    if (!tournament) notFound();

    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold text-text-main mb-8 uppercase tracking-widest">
                {tournament.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournament.teams.map((team) => (
                    <div key={team.id} className="bg-bg-panel p-6 rounded-xl border border-steel/20">
                        <h2 className="text-xl font-bold text-glow mb-4">{team.name}</h2>
                        <ul className="space-y-2">
                            {team.players.map((player) => (
                                <li key={player.id} className="text-steel flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blood rounded-full"></span>
                                    {player.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
}