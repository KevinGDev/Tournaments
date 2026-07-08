'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTournament(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_auth')) {
        throw new Error("Non autorisé");
    }

    const name = formData.get("name") as string;
    const date = new Date(formData.get("date") as string);

    await prisma.tournament.create({
        data: { name, date }
    });

    revalidatePath("/admin");
    revalidatePath("/");
}

export async function addTeamToTournament(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_auth')) throw new Error("Non autorisé");

    const name = formData.get("name") as string;
    const tournamentId = formData.get("tournamentId") as string;

    await prisma.team.create({
        data: {
            name,
            tournamentId
        }
    });

    revalidatePath("/admin");
}

export async function addPlayerToTeam(formData: FormData) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_auth')) throw new Error("Non autorisé");

    const name = formData.get("name") as string;
    const teamId = formData.get("teamId") as string;

    await prisma.player.create({
        data: {
            name,
            teamId
        }
    });

    revalidatePath("/admin");
}

export async function deleteTournament(formData: FormData) {
    const id = formData.get("id") as string;

    await prisma.tournament.delete({
        where: { id }
    });

    revalidatePath("/admin"); // Rafraîchit la page après suppression
}

export async function updateTournament(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const date = new Date(formData.get("date") as string);

    await prisma.tournament.update({
        where: { id },
        data: { name, date },
    });
    revalidatePath("/"); // Rafraîchit la page pour voir les changements
}

export async function generateMatches(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: { teams: true }
    });

    if (!tournament || tournament.teams.length < 2) return;

    const shuffledTeams = [...tournament.teams].sort(() => Math.random() - 0.5);

    // Création des matchs (par paires)
    for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (shuffledTeams[i + 1]) {
            await prisma.match.create({
                data: {
                    tournamentId,
                    teamA: shuffledTeams[i].name,
                    teamB: shuffledTeams[i + 1].name,
                    status: "PENDING"
                }
            });
        }
    }
    revalidatePath(`/tournament/${tournamentId}`);
}

export async function finishTournament(tournamentId: string) {
    try {
        await prisma.tournament.update({
            where: { id: tournamentId },
            data: { isFinished: true }
        });
        // Important : indique à Next.js de recharger la page Admin
        revalidatePath("/admin");
    } catch (error) {
        console.error("Erreur lors de la fermeture du tournoi:", error);
    }
}