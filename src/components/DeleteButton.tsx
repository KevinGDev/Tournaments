'use client'

import { deleteTournament } from "@/app/actions";

export default function DeleteButton({ id }: { id: string }) {
    return (
        <form action={deleteTournament}>
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                onClick={(e) => {
                    if (!confirm("Supprimer ce tournoi et toutes ses équipes ?")) {
                        e.preventDefault();
                    }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-bg-dark border border-steel/30 rounded-lg hover:border-blood hover:text-blood transition-all text-sm font-bold text-steel"            >
                Supprimer
            </button>
        </form>
    );
}