import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized Access Blocked' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Standardize filename to be web safe
        const timestamp = Date.now();
        const safeName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase()}`;

        // 1. Upload the physical asset directly into Supabase Storage
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from('media') // Pointing to your Supabase Bucket named "media"
            .upload(`uploads/${safeName}`, buffer, {
                contentType: file.type || 'image/jpeg',
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            console.error("Supabase Storage Error:", storageError);
            throw new Error(`Storage Error: Please make sure you have created a PUBLIC bucket named "media" in your Supabase Dashboard. (${storageError.message})`);
        }

        // 2. Fetch the publicly readable URL from Supabase
        const { data: publicUrlData } = supabase
            .storage
            .from('media')
            .getPublicUrl(`uploads/${safeName}`);

        const finalUrl = publicUrlData.publicUrl;

        // 3. Document the upload persistently in your `media_library` SQL table
        const { error: dbError } = await supabase
            .from('media_library')
            .insert({
                file_url: finalUrl,
                alt_text: file.name,
                width: 0, // In production, we'd calculate real dimensions here
                height: 0,
                file_size: file.size,
            });

        if (dbError) {
            console.error("Supabase DB Error:", dbError);
            throw new Error("File uploaded, but failed to log it in your media_library table.");
        }

        // Return the clean Database URL
        return NextResponse.json({ url: finalUrl });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
