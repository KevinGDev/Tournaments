'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { MatchScore } from "@/app/types/tournament";

async function buildTournamentTree(tournamentId: string) {
    const teams = await prisma.team.findMany({ where: { tournamentId } });
    if (teams.length < 2) throw new Error("Pas assez d'équipes.");

    const n = teams.length;
    const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)));

    let currentRoundParticipants: (string | null)[] = [...teams.map(t => t.id)];
    while (currentRoundParticipants.length < powerOfTwo) {
        currentRoundParticipants.push(null);
    }

    let round = 1;
    while (currentRoundParticipants.length > 1) {
        const nextRoundParticipants: (string | null)[] = [];

        for (let i = 0; i < currentRoundParticipants.length; i += 2) {
            await prisma.match.create({
                data: {
                    tournamentId,
                    round,
                    status: "PENDING",
                    matchOrder: i / 2,
                    teamAId: currentRoundParticipants[i],
                    teamBId: currentRoundParticipants[i + 1]
                }
            });
            nextRoundParticipants.push(null);
        }
        currentRoundParticipants = nextRoundParticipants;
        round++;
    }
}

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
    const dateInput = formData.get("date") as string;
    const isFFA = formData.get("isFFA") === "on";

    const utcDate = new Date(`${dateInput}:00.000Z`);
    await prisma.tournament.create({
        data: { name, date: utcDate, isFFA }
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
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) throw new Error("Non autorisé");

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const dateInput = formData.get("date") as string;
    const isFFA = formData.get("isFFA") === "on";

    const localDate = new Date(dateInput);
    const dateToStore = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));

    await prisma.tournament.update({
        where: { id },
        data: { name, date: dateToStore, isFFA },
    });

    revalidatePath("/admin");
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

export async function finishTournament(tournamentId: string, winnerId?: string) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_token')) throw new Error("Non autorisé");

    console.log("Serveur - Tentative de sauvegarde du vainqueur :", winnerId); // DEBUG

    // Mise à jour du tournoi avec le vainqueur et le statut terminé
    const updatedTournament = await prisma.tournament.update({
        where: { id: tournamentId },
        data: {
            isFinished: true,
            winnerId: winnerId || null, // Enregistre l'ID ou null si non fourni
        }
    });

    console.log("Serveur - Tournoi mis à jour :", updatedTournament); // DEBUG

    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/admin");
}
export async function generateBracketAction(tournamentId: string) {
    const teams = await prisma.team.findMany({ where: { tournamentId } });
    if (teams.length < 2) return { success: false, message: "Il faut au moins 2 équipes." };

    const existingMatches = await prisma.match.findFirst({ where: { tournamentId } });
    if (existingMatches) return { success: true };

    await buildTournamentTree(tournamentId);
    revalidatePath(`/tournaments/${tournamentId}`);
    return { success: true };
}

export async function completeRoundAction(tournamentId: string, roundId: number, results: MatchScore[]) {
    await prisma.$transaction(
        results.map(res => prisma.match.update({
            where: { id: res.matchId },
            data: { scoreA: res.scoreA, scoreB: res.scoreB, status: 'FINISHED' }
        }))
    );

    const allRoundMatches = await prisma.match.findMany({ where: { tournamentId, round: roundId } });
    const advancingTeams: string[] = [];

    for (const m of allRoundMatches) {
        if (m.teamAId && m.teamBId) {
            const res = results.find(r => r.matchId === m.id);
            if (res && res.scoreA > res.scoreB) advancingTeams.push(m.teamAId);
            else if (res) advancingTeams.push(m.teamBId);
        } else {
            const teamId = m.teamAId || m.teamBId;
            if (teamId) advancingTeams.push(teamId);
        }
    }

    if (advancingTeams.length > 1) {
        const nextRound = roundId + 1;
        for (let i = 0; i < advancingTeams.length; i += 2) {
            await prisma.match.create({
                data: {
                    tournamentId,
                    round: nextRound,
                    matchOrder: i / 2,
                    teamAId: advancingTeams[i],
                    teamBId: advancingTeams[i + 1] || null,
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

    if (!teamName || players.length === 0) throw new Error("Données requises");

    await prisma.team.create({
        data: {
            name: teamName,
            tournamentId,
            players: { create: players.map(name => ({ name })) }
        }
    });

    revalidatePath(`/tournaments/${tournamentId}`);
}