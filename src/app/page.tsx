import { prisma } from "@/lib/prisma";
import HomeView from "@/components/HomeView";

export default async function Page() {
    // Appel serveur sécurisé et direct
    const tournaments = await prisma.tournament.findMany();

    // On passe les données au composant client
    return <HomeView tournaments={tournaments} />;
}