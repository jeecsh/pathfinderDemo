import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // Upload to Supabase storage
    const { error } = await supabase
      .storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Logo upload error:', error);
      return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('logos')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
