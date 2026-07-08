import Link from 'next/link';

export default function TournamentCard({ id, name }: { id: string; name: string }) {
    return (
        <Link href={`/tournois/${id}`} className="block group">
            <div className="relative overflow-hidden border-l-4 border-l-blood bg-bg-panel p-6 shadow-xl transition-all duration-300 hover:border-l-glow hover:bg-bg-dark/50 hover:shadow-2xl hover:shadow-glow/10">

                {/* L'effet de diagonale tranchante (en haut à droite) */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent via-glow/10 to-glow/20 transform rotate-45 translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:translate-x-8 group-hover:-translate-y-8" />

                {/* Bordure biseautée subtile (coin inférieur droit) */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-blood/20 to-transparent" />

                <h2 className="relative text-xl font-bold uppercase tracking-widest text-text-main group-hover:text-glow transition-colors">
                    {name}
                </h2>

                <p className="relative mt-2 text-sm text-steel uppercase tracking-wider">
                    Accéder au tournoi
                </p>

                <div className="absolute bottom-2 right-4 text-[10px] text-steel/50 font-mono">
                    [ID: {id.slice(0, 8).toUpperCase()}]
                </div>
            </div>
        </Link>
    );
}