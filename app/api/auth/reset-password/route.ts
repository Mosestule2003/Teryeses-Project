import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const payload = await verifyToken(token);

        if (!payload || payload.purpose !== 'password_reset' || !payload.email) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Token is valid! Hash the new password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Intentionally targeting admin_users explicitly
        const { error } = await supabase
            .from('admin_users')
            .update({ password_hash: hashedPassword })
            .eq('email', payload.email);

        if (error) {
            console.error(error);
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully. You may now login.' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
