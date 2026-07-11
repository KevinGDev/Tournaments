'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {MatchScore} from "@/app/types/tournament";

async function buildTournamentTree(tournamentId: string) {
    const teams = await prisma.team.findMany({ where: { tournamentId } });
    if (teams.length < 2) throw new Error("Pas assez d'équipes.");

    const n = teams.length;
    const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)));

    // 1. Initialisation : le Round 1 a les vraies équipes ou null
    let currentRoundParticipants: (string | null)[] = [...teams.map(t => t.id)];
    while (currentRoundParticipants.length < powerOfTwo) {
        currentRoundParticipants.push(null);
    }

    // 2. Création des matchs de manière itérative
    let round = 1;
    while (currentRoundParticipants.length > 1) {
        const nextRoundParticipants: (string | null)[] = [];

        for (let i = 0; i < currentRoundParticipants.length; i += 2) {
            const teamAId = currentRoundParticipants[i];
            const teamBId = currentRoundParticipants[i + 1];

            // On crée le match en base. Prisma accepte les IDs nulls.
            await prisma.match.create({
                data: {
                    tournamentId,
                    round,
                    status: "PENDING",
                    matchOrder: i / 2,
                    teamAId: teamAId, // Peut être null
                    teamBId: teamBId  // Peut être null
                }
            });

            // Pour le tour suivant, on met null (on ne connaît pas encore le vainqueur)
            nextRoundParticipants.push(null);
        }
        currentRoundParticipants = nextRoundParticipants;
        round++;
    }
}
// --- ACTIONS D'ADMINISTRATION ---

export async function loginAdminAction(password: string) {
    if (!process.env.ADMIN_SECRET_TOKEN) return { success: false, message: "Erreur config" };

    if (password === process.env.ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set("admin_token", process.env.ADMIN_SECRET_TOKEN, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return { success: true };
    }
    return { success: false, message: "Mot de passe incorrect" };
}

export async function createTournament(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) throw new Error("Non autorisé");

    const name = formData.get("name") as string;
    const dateInput = formData.get("date") as string; // ex: "2026-07-11T11:34"

    // 1. On crée la date à partir de la chaîne locale
    const localDate = new Date(dateInput);

    // 2. On corrige le décalage pour forcer Prisma à stocker l'heure "murale" exacte
    // On ajoute le décalage du fuseau horaire pour compenser la conversion UTC automatique
    const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));

    await prisma.tournament.create({
        data: {
            name,
            date: utcDate
        }
    });

    revalidatePath("/admin");
    revalidatePath("/");
}

export async function deleteTournament(formData: FormData) {
    const id = formData.get("id") as string;
    await prisma.tournament.delete({ where: { id } });
    revalidatePath("/admin");
}

export async function updateTournament(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const date = new Date(formData.get("date") as string);

    await prisma.tournament.update({
        where: { id },
        data: { name, date },
    });
    revalidatePath("/");
}

export async function addTeamToTournament(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) throw new Error("Non autorisé");

    const name = formData.get("name") as string;
    const tournamentId = formData.get("tournamentId") as string;

    await prisma.team.create({ data: { name, tournamentId } });
    revalidatePath("/admin");
}

export async function addPlayerToTeam(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) throw new Error("Non autorisé");

    const name = formData.get("name") as string;
    const teamId = formData.get("teamId") as string;

    await prisma.player.create({ data: { name, teamId } });
    revalidatePath("/admin");
}

export async function finishTournament(tournamentId: string) {
    await prisma.tournament.update({
        where: { id: tournamentId },
        data: { isFinished: true }
    });
    revalidatePath("/admin");
}

// --- GESTION BRACKETS ---

export async function generateBracketAction(tournamentId: string) {
    const teams = await prisma.team.findMany({ where: { tournamentId } });

    // Si pas assez d'équipes, on ne fait rien ou on renvoie une erreur gérable
    if (teams.length < 2) {
        return { success: false, message: "Il faut au moins 2 équipes pour générer un tournoi." };
    }

    const existingMatches = await prisma.match.findFirst({ where: { tournamentId } });
    if (existingMatches) return { success: true };

    await buildTournamentTree(tournamentId);
    revalidatePath(`/tournaments/${tournamentId}`);
    return { success: true };
}

export async function completeRoundAction(
    tournamentId: string,
    roundId: number,
    results: MatchScore[]
) {
    // 1. Mettre à jour les scores
    await prisma.$transaction(
        results.map(res => prisma.match.update({
            where: { id: res.matchId },
            data: { scoreA: res.scoreA, scoreB: res.scoreB, status: 'FINISHED' }
        }))
    );

    // 2. Récupérer TOUS les matchs de ce round pour identifier les Byes
    const allRoundMatches = await prisma.match.findMany({ where: { tournamentId, round: roundId } });

    // Identifier les gagnants et les qualifiés
    const advancingTeams: string[] = [];
    for (const m of allRoundMatches) {
        if (m.teamAId && m.teamBId) {
            // Match réel
            const res = results.find(r => r.matchId === m.id);
            if (res && res.scoreA > res.scoreB) advancingTeams.push(m.teamAId);
            else if (res) advancingTeams.push(m.teamBId);
        } else {
            // Bye : L'équipe présente avance automatiquement
            const teamId = m.teamAId || m.teamBId;
            if (teamId) advancingTeams.push(teamId);
        }
    }

    // 3. Génération du round suivant (seulement s'il reste plus d'une équipe)
    if (advancingTeams.length > 1) {
        const nextRound = roundId + 1;
        // Optionnel : ne pas mélanger si tu veux garder l'arbre cohérent,
        // mais le sort() est correct pour le côté aléatoire.
        const pool = [...advancingTeams];

        for (let i = 0; i < pool.length; i += 2) {
            await prisma.match.create({
                data: {
                    tournamentId,
                    round: nextRound,
                    matchOrder: i / 2,
                    teamAId: pool[i],
                    teamBId: pool[i + 1] || null, // Si impair, le suivant aura un Bye
                    status: 'PENDING'
                }
            });
        }
    } else {
        await prisma.tournament.update({ where: { id: tournamentId }, data: { isFinished: true } });
    }

    revalidatePath(`/tournament/${tournamentId}`);
}

export async function registerTeamAction(formData: FormData) {
    const tournamentId = formData.get("tournamentId") as string;
    const teamName = formData.get("teamName") as string;
    const players = (formData.get("players") as string).split(',').map(p => p.trim()).filter(p => p !== "");

    if (!teamName || players.length === 0) throw new Error("Nom d'équipe et joueurs requis");

    await prisma.team.create({
        data: {
            name: teamName,
            tournamentId,
            players: {
                create: players.map(name => ({ name }))
            }
        }
    });

    revalidatePath(`/tournaments/${tournamentId}`);
}