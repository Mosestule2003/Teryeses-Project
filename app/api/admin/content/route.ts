import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request) {
    try {
        // Must aggressively verify JWT token to make sure NO ONE can edit the website without credentials
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized Access Blocked' }, { status: 401 });
        }

        const { id, content_json } = await request.json();

        if (!id || !content_json) {
            return NextResponse.json({ error: 'Missing Required Payload' }, { status: 400 });
        }

        // Database call to update the site_content row
        const { data, error } = await supabase
            .from('site_content')
            .update({ content_json })
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
