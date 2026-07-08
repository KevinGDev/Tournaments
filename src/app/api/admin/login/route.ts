import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from "@/lib/auth";

export async function POST(request: Request) {
    const formData = await request.formData();
    if (formData.get('password') === ADMIN_PASSWORD) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.set('admin_auth', 'true', { httpOnly: true, secure: true });
        return response;
    }
    return new Response("Accès refusé", { status: 403 });
}