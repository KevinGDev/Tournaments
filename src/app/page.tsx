import { prisma } from "@/lib/prisma";
import HomeView from "@/components/HomeView";
import { cookies } from 'next/headers';

export default async function Page() {
    const tournaments = await prisma.tournament.findMany();
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_token')?.value === process.env.ADMIN_SECRET_TOKEN;
    // On passe les données au composant client
    return <HomeView tournaments={tournaments} isAdmin={isAdmin} />;
}