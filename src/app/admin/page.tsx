import { prisma } from "@/lib/prisma";
import { finishTournament } from "@/app/actions"; // Assure-toi que l'action est créée
import CreateTournamentModal from "@/components/CreateTournamentModal";
import AddTeamForm from "@/components/AddTeamForm";
import AddPlayerForm from "@/components/AddPlayerForm";
import DeleteButton from "@/components/DeleteButton";
import { Calendar, Users, Trophy } from "lucide-react";
import EditTournamentModal from "@/components/EditTournamentModal";
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const tournaments = await prisma.tournament.findMany({
        include: {
            teams: {
                include: { players: true }
            }
        },
        orderBy: { date: 'desc' }
    });

    return (
        <main className="min-h-screen p-8 text-text-main">
            {/* Header */}
            <header className="mb-12 border-b border-steel/30 pb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic text-text-main">
                    Panneau <span className="text-blood">Administration</span>
                </h1>
                <p className="text-steel mt-2">Gérez vos tournois, équipes et participants.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Colonne 1 : Actions rapides */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-bg-panel p-6 rounded-2xl border border-steel/20">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-glow">
                            <Trophy className="w-5 h-5 text-blood" /> Gestion
                        </h2>
                        <CreateTournamentModal />
                    </div>
                </aside>

                {/* Colonne 2 : Liste des tournois */}
                <div className="lg:col-span-3 space-y-8">
                    {tournaments.map(t => (
                        <div key={t.id} className="bg-bg-panel/50 p-8 rounded-2xl border border-steel/20 hover:border-blood/50 transition-all shadow-xl">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold uppercase tracking-widest text-text-main mb-2">{t.name}</h3>
                                    <div className="flex items-center gap-2 text-steel text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {t.date ? new Date(t.date).toLocaleDateString('fr-FR', { dateStyle: 'long' }) : "Date non définie"}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="bg-blood/10 text-blood px-3 py-1 rounded-full text-xs font-bold border border-blood/20">
                                        {t.teams.length} Équipes
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Bouton Terminer avec action serveur */}
                                        <form action={async () => {
                                            "use server"
                                            await finishTournament(t.id)
                                        }}>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-1 px-3 py-1 bg-green-900/20 border border-green-500/30 text-green-500 rounded text-xs font-bold hover:bg-green-900/40 transition-all"
                                            >
                                                <Trophy className="w-3 h-3" /> Terminer
                                            </button>
                                        </form>

                                        <EditTournamentModal tournament={t} />
                                        <DeleteButton id={t.id} />
                                    </div>
                                </div>
                            </div>

                            {/* Grille des équipes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {t.teams.map(team => (
                                    <div key={team.id} className="bg-bg-dark/50 p-4 rounded-xl border border-steel/20">
                                        <p className="font-bold text-text-main mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-steel" /> {team.name}
                                        </p>
                                        <ul className="space-y-1 mb-4">
                                            {team.players.map(player => (
                                                <li key={player.id} className="text-xs text-steel flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-blood"></span>
                                                    {player.name}
                                                </li>
                                            ))}
                                        </ul>
                                        <AddPlayerForm teamId={team.id} />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-steel/20">
                                <AddTeamForm tournamentId={t.id} />
                            </div>
                        </div>
                    ))}

                    {tournaments.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-steel/30 rounded-2xl text-steel">
                            Aucun tournoi actif.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}