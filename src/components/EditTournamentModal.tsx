'use client'

import { useState } from 'react';
import { updateTournament } from "@/app/actions";
import { Edit, Save, X } from "lucide-react";

export default function EditTournamentModal({ tournament }: { tournament: any }) {
    const [isOpen, setIsOpen] = useState(false);

    // Conversion de la date pour le champ input datetime-local
    const dateObj = new Date(tournament.date);
    const formattedDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-bg-dark border border-steel/30 rounded-lg hover:border-glow transition-all text-sm font-bold text-text-main"
            >
                <Edit className="w-4 h-4 text-glow" /> Éditer
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-bg-panel border border-steel/30 p-8 rounded-xl w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 uppercase tracking-widest text-text-main">Modifier</h2>

                        <form
                            action={async (fd) => {
                                await updateTournament(fd);
                                setIsOpen(false);
                            }}
                            className="space-y-4"
                        >
                            <input type="hidden" name="id" value={tournament.id} />

                            <input
                                name="name"
                                defaultValue={tournament.name}
                                className="w-full p-3 bg-bg-dark border border-steel/30 rounded"
                                required
                            />

                            <input
                                type="datetime-local"
                                name="date"
                                defaultValue={formattedDate}
                                className="w-full p-3 bg-bg-dark border border-steel/30 rounded"
                                required
                            />

                            {/* Option FFA */}
                            <label className="flex items-center gap-3 p-3 bg-bg-dark border border-steel/30 rounded cursor-pointer hover:bg-steel/5 transition-colors">
                                <input
                                    type="checkbox"
                                    name="isFFA"
                                    defaultChecked={!!tournament.isFFA}
                                    className="w-4 h-4 accent-blood"
                                />
                                <span className="text-text-main text-sm">Mode &#34;Free For All&#34;</span>
                            </label>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-steel hover:text-white border border-steel/20 rounded"
                                >
                                    <X className="w-4 h-4" /> Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 bg-blood py-2 rounded font-bold text-white"
                                >
                                    <Save className="w-4 h-4" /> Sauvegarder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}