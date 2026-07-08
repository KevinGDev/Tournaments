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