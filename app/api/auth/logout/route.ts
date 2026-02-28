import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    // Return a 303 See Other redirect so the browser uses a GET request to hit the landing page
    return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
