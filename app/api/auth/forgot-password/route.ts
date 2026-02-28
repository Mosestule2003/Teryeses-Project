import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signResetToken } from '@/lib/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { data: user, error } = await supabase
            .from('admin_users')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error || !user) {
            // We return generic success so attackers can't verify existing emails
            return NextResponse.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const resetToken = await signResetToken({ email: user.email, purpose: 'password_reset' });

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const resetLink = `${origin}/admin/reset-password?token=${resetToken}`;

        // In a real application, make sure RESEND_API_KEY is configured in Vercel
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Admin System <onboarding@resend.dev>', // Update this verified domain in production
                to: [user.email],
                subject: 'Admin Password Reset Request',
                html: `<p>You requested a password reset. Click the link below to securely create a new password:</p>
                       <p><a href="${resetLink}"><strong>Reset Password</strong></a></p>
                       <p>If you did not request this, please ignore it. This link expires in 15 minutes.</p>`
            });
        } else {
            // For developers running this locally without a RESEND_API_KEY hooked up:
            console.log("No RESEND_API_KEY set. Reset Link:", resetLink);
        }

        return NextResponse.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
