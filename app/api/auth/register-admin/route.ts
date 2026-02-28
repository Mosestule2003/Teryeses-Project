import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // Enforce security: Only authorized admins can create new admins
        const session = await getSession();
        if (!session || !session.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        // 1. Check if the user already exists in admin_users
        const { data: existingUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 400 });
        }

        // 2. Hash the password securely with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert new admin
        const { error } = await supabase
            .from('admin_users')
            .insert({
                email,
                password_hash: hashedPassword,
                role: 'admin'
            });

        if (error) {
            console.error('Failed to create new admin:', error);
            return NextResponse.json({ error: 'Failed to create new admin user' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'New administrator created successfully.' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
