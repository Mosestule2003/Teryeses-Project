import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Fetch user from Supabase explicitly querying our admin_users table
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('id, email, password_hash, role')
            .eq('email', cleanEmail)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: error?.message || 'User not found in database', details: error }, { status: 401 });
        }

        // 2. Verify password securely with bcrypt
        const cleanPassword = password.trim();
        const isValid = await bcrypt.compare(cleanPassword, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password hash comparison' }, { status: 401 });
        }

        // 3. Create the JWT token containing non-sensitive payload
        const token = await signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // 4. Securely set the HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours expiry
        });

        return NextResponse.json({ success: true, redirectUrl: '/admin/dashboard' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
