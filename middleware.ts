import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    // We only want to protect /admin/* routes, except /admin/login
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin_session')?.value;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Validate the JWT Token
        const payload = await verifyToken(session);
        if (!payload) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Valid session, user is logged in securely
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
