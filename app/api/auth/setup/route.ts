import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// WARNING: Temporary route to seed your admin credentials.
// Delete this route or rename it after you've created your admin account.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email') || 'taetule@gmail.com';
        const password = searchParams.get('password') || 'admin123'; // Default temp password

        // Check if admin already exists
        const { data: existingAdmin } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingAdmin) {
            return NextResponse.json({ message: `Admin ${email} already exists.` });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('admin_users')
            .insert([
                {
                    email,
                    password_hash,
                    role: 'admin'
                }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Admin user ${email} created explicitly! Your password is: ${password}`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
