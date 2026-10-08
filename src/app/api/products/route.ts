import { NextRequest, NextResponse } from 'next/server';
import { getServerProducts, saveServerProduct } from '@/lib/data/server-store';
import { ProductStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as ProductStatus) || undefined;
    const publishedOnly = searchParams.get('publishedOnly') === 'false' ? false : searchParams.has('publishedOnly') ? true : undefined;
    const includeArchived = searchParams.get('includeArchived') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';
    const stockOnly = searchParams.get('stockOnly') === 'true';
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    const products = await getServerProducts({
      categorySlug,
      brand,
      condition,
      search,
      status,
      publishedOnly,
      includeArchived,
      featuredOnly,
      stockOnly,
      minPrice,
      maxPrice,
    });

    return NextResponse.json(products);
  } catch (err: any) {
    console.error('API products GET error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || body.price === undefined || !body.brand) {
      return NextResponse.json(
        { error: 'Product name, brand, and valid price are required fields.' },
        { status: 400 }
      );
    }

    const saved = await saveServerProduct(body);

    return NextResponse.json({
      success: true,
      product: saved,
      message: saved.status === 'published' ? 'Product published successfully.' : 'Product updated successfully.',
    });
  } catch (err: any) {
    console.error('API products POST error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}
