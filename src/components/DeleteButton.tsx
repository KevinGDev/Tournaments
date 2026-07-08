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
                className="text-zinc-600 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest font-bold"
            >
                Supprimer
            </button>
        </form>
    );
}