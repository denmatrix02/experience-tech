import { NextRequest, NextResponse } from 'next/server';
import {
  getServerCategories,
  saveServerCategory,
  archiveServerCategory,
  restoreServerCategory,
  deleteServerCategory,
} from '@/lib/data/server-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const categories = await getServerCategories(includeArchived);
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const saved = await saveServerCategory(body);
    return NextResponse.json({
      success: true,
      category: saved,
      message: body.id ? 'Category updated successfully.' : 'Category created successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save category' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
    }

    if (action === 'archive') {
      const archived = await archiveServerCategory(id);
      return NextResponse.json({
        success: true,
        category: archived,
        message: 'Category archived successfully.',
      });
    }

    if (action === 'restore') {
      const restored = await restoreServerCategory(id);
      return NextResponse.json({
        success: true,
        category: restored,
        message: 'Category restored successfully.',
      });
    }

    const saved = await saveServerCategory(body);
    return NextResponse.json({
      success: true,
      category: saved,
      message: 'Category updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
    }

    await deleteServerCategory(id, permanent);
    return NextResponse.json({
      success: true,
      message: permanent ? 'Category permanently deleted.' : 'Category archived successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete category' }, { status: 500 });
  }
}
