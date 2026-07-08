import { createTournament } from "@/app/actions";
export default function AdminForm() {
    return (
        <form action={createTournament} className="p-6 rounded-xl border border-steel/20 bg-bg-panel shadow-xl">
            <h2 className="text-xl font-bold text-text-main mb-6">Ajouter un tournoi</h2>
            <div className="space-y-4">
                <input name="name" placeholder="Nom du tournoi" className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-text-main" required />
                <input type="datetime-local" name="date" className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-steel" required />
                <button type="submit" className="w-full bg-blood hover:bg-glow text-white font-bold py-3 rounded">Ajouter</button>
            </div>
        </form>
    );
}