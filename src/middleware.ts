import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // On laisse passer l'API de login et la page d'accueil
    if (pathname.startsWith('/api/admin/login') || pathname === '/') {
        return NextResponse.next();
    }

    // Protection du dossier /admin
    if (pathname.startsWith('/admin')) {
        if (!request.cookies.get('admin_auth')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    return NextResponse.next();
}