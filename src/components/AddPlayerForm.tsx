import { addPlayerToTeam } from "@/app/actions";

export default function AddPlayerForm({ teamId }: { teamId: string }) {
    return (
        <form action={addPlayerToTeam} className="flex gap-1 mt-2 ml-4">
            <input type="hidden" name="teamId" value={teamId} />
            <input
                name="name"
                placeholder="Nom du joueur"
                className="p-1 bg-bg-dark border border-steel/30 rounded text-text-main text-xs focus:border-blood outline-none transition-colors"
                required
            />
            <button
                type="submit"
                className="bg-steel/20 hover:bg-blood text-text-main hover:text-white px-2 rounded text-xs transition-colors"
            >
                +
            </button>
        </form>
    );
}