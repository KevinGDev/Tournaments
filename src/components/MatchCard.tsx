function MatchCard({ match }: { match: any }) {
    return (
        <div className="bg-bg-panel border border-steel/20 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between text-sm">
                <span>{match.teamA.name}</span>
                <span className="font-bold">{match.scoreA}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
                <span>{match.teamB.name}</span>
                <span className="font-bold">{match.scoreB}</span>
            </div>
            {match.winnerId && (
                <div className="text-xs text-blood mt-2 pt-2 border-t border-steel/20 uppercase font-bold text-center">
                    Vainqueur: {match.winnerName}
                </div>
            )}
        </div>
    );
}