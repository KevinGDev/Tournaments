import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // On ne protège que la route /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_token')?.value;

        // Vérifie si le token correspond à celui défini dans votre .env
        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            // Si le token est invalide, on redirige vers l'accueil
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Configuration pour appliquer le middleware uniquement sur /admin
export const config = {
    matcher: '/admin/:path*',
};