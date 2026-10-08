import { NextRequest, NextResponse } from 'next/server';
import {
  getServerProductById,
  saveServerProduct,
  archiveServerProduct,
  restoreServerProduct,
  deleteServerProduct,
} from '@/lib/data/server-store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const product = await getServerProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error fetching product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await getServerProductById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (body.action === 'archive') {
      const archived = await archiveServerProduct(id);
      return NextResponse.json({
        success: true,
        product: archived,
        message: 'Product archived successfully.',
      });
    }

    if (body.action === 'restore') {
      const restored = await restoreServerProduct(id);
      return NextResponse.json({
        success: true,
        product: restored,
        message: 'Product restored successfully.',
      });
    }

    if (body.action === 'unpublish') {
      const updated = await saveServerProduct({
        ...existing,
        status: 'draft',
        is_published: false,
      });
      return NextResponse.json({
        success: true,
        product: updated,
        message: 'Product unpublished successfully.',
      });
    }

    if (body.action === 'publish') {
      const updated = await saveServerProduct({
        ...existing,
        status: 'published',
        is_published: true,
      });
      return NextResponse.json({
        success: true,
        product: updated,
        message: 'Product published successfully.',
      });
    }

    // Standard partial update (e.g. price change, stock status change, featured toggle)
    const updated = await saveServerProduct({
      ...existing,
      ...body,
      id,
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'Product updated successfully.',
    });
  } catch (err: any) {
    console.error('API products PATCH error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    const existing = await getServerProductById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (permanent) {
      await deleteServerProduct(id, { permanent: true });
      return NextResponse.json({
        success: true,
        message: `Product "${existing.name}" permanently deleted.`,
      });
    } else {
      await archiveServerProduct(id);
      return NextResponse.json({
        success: true,
        message: 'Product archived successfully.',
      });
    }
  } catch (err: any) {
    console.error('API products DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete product' }, { status: 500 });
  }
}
