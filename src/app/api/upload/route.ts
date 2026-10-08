import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const filesToProcess: File[] = [];
    if (singleFile) filesToProcess.push(singleFile);
    if (files && files.length > 0) {
      for (const f of files) {
        if (!filesToProcess.some((p) => p.name === f.name && p.size === f.size)) {
          filesToProcess.push(f);
        }
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload.' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    for (const file of filesToProcess) {
      // 1. Validation
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file format for "${file.name}". Only JPG, PNG, WEBP, GIF, and AVIF images are permitted.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the maximum 5MB size limit.`,
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFilename = `${cleanBase}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}${ext}`;

      // 2. Attempt Supabase Storage upload if available
      let uploadedToSupabase = false;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.storage
            .from('products')
            .upload(uniqueFilename, buffer, {
              contentType: file.type,
              upsert: true,
            });

          if (!error && data) {
            const { data: publicData } = supabase.storage
              .from('products')
              .getPublicUrl(data.path);

            if (publicData?.publicUrl) {
              uploadedUrls.push(publicData.publicUrl);
              uploadedToSupabase = true;
            }
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload fallback:', storageErr);
        }
      }

      // 3. Fallback to local public/uploads directory
      if (!uploadedToSupabase) {
        const filePath = path.join(uploadsDir, uniqueFilename);
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${uniqueFilename}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
      count: uploadedUrls.length,
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'An unexpected error occurred during image upload.' },
      { status: 500 }
    );
  }
}
