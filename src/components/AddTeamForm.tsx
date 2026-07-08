import { addTeamToTournament } from "@/app/actions";

export default function AddTeamForm({ tournamentId }: { tournamentId: string }) {
    return (
        <form action={addTeamToTournament} className="flex gap-2 mt-4">
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <input
                name="name"
                placeholder="Nom de l'équipe"
                className="flex-1 p-2 bg-bg-dark border border-steel/30 rounded text-text-main text-sm focus:border-blood outline-none transition-colors"
                required
            />
            <button
                type="submit"
                className="bg-blood text-white px-4 py-2 rounded text-sm font-bold hover:bg-glow transition-all"
            >
                + Ajouter
            </button>
        </form>
    );
}