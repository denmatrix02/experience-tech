import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import dns from 'dns';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prioritize IPv4 to avoid IPv6 connect timeouts on certain network interfaces
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const isRemoteStorageConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  !supabaseUrl.includes('placeholder')
);

const storageClient: SupabaseClient | null = isRemoteStorageConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Resolves or creates a public Supabase Storage bucket for product images.
 */
async function resolveStorageBucket(client: SupabaseClient): Promise<string> {
  const preferred = process.env.SUPABASE_STORAGE_BUCKET;
  if (preferred) return preferred;

  // Check known candidate buckets: 'products', then 'experience-tech'
  const candidateBuckets = ['products', 'experience-tech'];
  try {
    const { data: buckets } = await client.storage.listBuckets();
    if (buckets && buckets.length > 0) {
      for (const candidate of candidateBuckets) {
        if (buckets.some((b) => b.name === candidate)) {
          return candidate;
        }
      }
      // If candidates aren't present, return the first public bucket or candidate
      const existingPublic = buckets.find((b) => b.public);
      if (existingPublic) return existingPublic.name;
    }

    // If bucket doesn't exist yet, auto-create 'products' with public access
    const { data: created, error } = await client.storage.createBucket('products', {
      public: true,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      fileSizeLimit: MAX_FILE_SIZE,
    });
    if (!error && created) {
      return 'products';
    }
  } catch (err) {
    console.warn('Bucket resolution warning, using fallback "products":', err);
  }

  return 'products';
}

export async function POST(req: NextRequest) {
  const uploadedForCleanup: { bucket: string; path: string }[] = [];

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

    // Ensure remote persistent storage is available for production/serverless
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

    if (isServerless && (!isRemoteStorageConfigured || !storageClient)) {
      return NextResponse.json(
        {
          error:
            'Persistent remote cloud storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting environment settings.',
        },
        { status: 500 }
      );
    }

    let targetBucket: string | null = null;
    if (storageClient) {
      targetBucket = await resolveStorageBucket(storageClient);
    }

    for (const file of filesToProcess) {
      // 1. Validation
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file format for "${file.name}". Permitted formats: JPG, PNG, WEBP, GIF, AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the maximum 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
          },
          { status: 400 }
        );
      }

      const fileExt = (
        path.extname(file.name) ||
        (file.type === 'image/png'
          ? '.png'
          : file.type === 'image/webp'
          ? '.webp'
          : file.type === 'image/avif'
          ? '.avif'
          : file.type === 'image/gif'
          ? '.gif'
          : '.jpg')
      ).toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        return NextResponse.json(
          {
            error: `File extension "${fileExt}" is not supported for "${file.name}".`,
          },
          { status: 400 }
        );
      }

      const cleanBase = path
        .basename(file.name, fileExt)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 60);
      const uniqueFilename = `${cleanBase || 'product'}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}${fileExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      // 2. Upload to Supabase Persistent Remote Storage
      if (storageClient && targetBucket) {
        let uploadResult = await storageClient.storage
          .from(targetBucket)
          .upload(uniqueFilename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        // If bucket error occurred, try fallback bucket 'experience-tech' or 'products'
        if (
          uploadResult.error &&
          (uploadResult.error.message?.includes('Bucket not found') ||
            (uploadResult.error as any).statusCode === '404')
        ) {
          const altBucket = targetBucket === 'products' ? 'experience-tech' : 'products';
          const retry = await storageClient.storage
            .from(altBucket)
            .upload(uniqueFilename, buffer, {
              contentType: file.type,
              upsert: true,
            });

          if (!retry.error && retry.data) {
            uploadResult = retry;
            targetBucket = altBucket;
          }
        }

        if (uploadResult.error || !uploadResult.data) {
          throw new Error(
            uploadResult.error?.message || `Failed to store "${file.name}" in persistent remote storage.`
          );
        }

        uploadedForCleanup.push({ bucket: targetBucket, path: uploadResult.data.path });

        const { data: publicData } = storageClient.storage
          .from(targetBucket)
          .getPublicUrl(uploadResult.data.path);

        if (!publicData?.publicUrl) {
          throw new Error(`Failed to generate public URL for "${file.name}".`);
        }

        uploadedUrls.push(publicData.publicUrl);
      } else {
        // 3. Local Development Fallback (ONLY for non-serverless local environments)
        if (isServerless) {
          throw new Error('Local file writes are not permitted in serverless production environments.');
        }

        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          await fs.mkdir(uploadsDir, { recursive: true });
          const filePath = path.join(uploadsDir, uniqueFilename);
          await fs.writeFile(filePath, buffer);
          uploadedUrls.push(`/uploads/${uniqueFilename}`);
        } catch (localErr: any) {
          throw new Error(`Failed to write local file: ${localErr?.message || localErr}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
      count: uploadedUrls.length,
    });
  } catch (err: any) {
    console.error('Image upload handler error:', err);

    // Rollback / clean up any files uploaded during this failed request
    if (storageClient && uploadedForCleanup.length > 0) {
      for (const item of uploadedForCleanup) {
        try {
          await storageClient.storage.from(item.bucket).remove([item.path]);
        } catch {}
      }
    }

    return NextResponse.json(
      { error: err?.message || 'An unexpected error occurred during image upload.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const imageUrl = (searchParams.get('url') || body?.url || '') as string;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required for deletion.' }, { status: 400 });
    }

    // Only attempt storage deletion if it is a Supabase Storage URL
    if (storageClient && imageUrl.includes('/storage/v1/object/public/')) {
      const match = imageUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
      if (match) {
        const bucket = match[1];
        const filePath = match[2];
        const { error } = await storageClient.storage.from(bucket).remove([filePath]);
        if (error) {
          console.warn('Storage delete warning:', error);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully.' });
  } catch (err: any) {
    console.error('Image delete handler error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete image.' },
      { status: 500 }
    );
  }
}
