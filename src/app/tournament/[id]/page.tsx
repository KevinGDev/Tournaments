import { prisma } from "@/lib/prisma";
import { Users, Calendar, Trophy } from "lucide-react"; // Ajout de Trophy
import { notFound } from "next/navigation";

export default async function TournamentPage({
                                                 params
                                             }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const tournament = await prisma.tournament.findUnique({
        where: { id: id },
        include: {
            teams: { include: { players: true } },
            matches: true // <--- IMPORTANT : Ajouté pour récupérer les matchs
        }
    });

    if (!tournament) notFound();

    return (
        <main className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <h1 className="text-5xl font-black text-text-main mb-2 uppercase italic">{tournament.name}</h1>
            <div className="flex items-center gap-2 text-steel mb-8">
                <Calendar className="w-5 h-5" />
                {new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
            </div>

            {/* Section Équipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {tournament.teams.map(team => (
                    <div key={team.id} className="bg-bg-panel/50 p-6 rounded-2xl border border-steel/20">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blood" /> {team.name}
                        </h2>
                        <ul className="space-y-2">
                            {team.players.map(player => (
                                <li key={player.id} className="text-steel flex items-center gap-2 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blood"></span>
                                    {player.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Section Matchs / Poules */}
            <section className="border-t border-steel/20 pt-12">
                <h2 className="text-2xl font-black uppercase text-glow mb-8 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-blood" /> État des matchs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tournament.matches.length > 0 ? (
                        tournament.matches.map(match => (
                            <div key={match.id} className="bg-bg-panel p-4 rounded-xl border border-steel/20 flex flex-col items-center">
                                <div className="flex justify-between w-full font-bold mb-2">
                                    <span>{match.teamA}</span>
                                    <span className="text-blood">{match.scoreA}</span>
                                </div>
                                <div className="text-steel text-xs uppercase italic">vs</div>
                                <div className="flex justify-between w-full font-bold mt-2">
                                    <span>{match.teamB}</span>
                                    <span className="text-blood">{match.scoreB}</span>
                                </div>
                                <div className={`mt-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                                    match.status === 'FINISHED' ? 'bg-blood/20 text-blood' : 'bg-steel/10 text-steel'
                                }`}>
                                    {match.status}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-steel italic col-span-3 text-center py-8">Aucun match programmé pour le moment.</p>
                    )}
                </div>
            </section>
        </main>
    );
}