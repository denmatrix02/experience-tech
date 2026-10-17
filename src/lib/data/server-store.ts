import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { Product, Category, ProductStatus } from '@/types';
import { initialProducts, initialCategories } from './initial-data';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../supabase/client';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export function toUuid(str: string): string {
  if (!str) return crypto.randomUUID();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return str;
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return hash.slice(0, 8) + '-' + hash.slice(8, 12) + '-4' + hash.slice(13, 16) + '-a' + hash.slice(17, 20) + '-' + hash.slice(20, 32);
}

function getDbClient() {
  return supabaseAdmin || supabase;
}

// Resilient query wrapper to guarantee serverless functions never hang or exceed Vercel execution timeouts
async function withDbTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = 3000): Promise<T> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Supabase query timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/* ============================================================
   1. PRODUCTS (SERVER)
   ============================================================ */
export async function getFileProducts(): Promise<Product[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  // If file doesn't exist or is empty, write initialProducts
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial products to file:', err);
  }
  return [...initialProducts];
}

export async function saveFileProducts(products: Product[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    // In serverless environments (e.g. Vercel), local filesystem is read-only.
    // Persistent records are synced to Supabase database; local JSON write is safely skipped.
  }
}

export async function getServerProducts(options?: {
  categorySlug?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  stockOnly?: boolean;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  includeArchived?: boolean;
  status?: ProductStatus;
}): Promise<Product[]> {
  let list: Product[] = [];
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      let query = db.from('products').select('*');

      if (options?.publishedOnly !== false && !options?.status && !options?.includeArchived) {
        query = query.eq('is_published', true).neq('status', 'archived').neq('is_archived', true);
      }
      if (options?.status) {
        query = query.eq('status', options.status);
      }
      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (options?.brand && options.brand !== 'all') {
        query = query.ilike('brand', options.brand);
      }

      const { data, error } = await withDbTimeout(
        query.order('created_at', { ascending: false }),
        3000
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        list = data as Product[];
      } else if (!error && Array.isArray(data) && data.length === 0) {
        // Supabase products table is currently empty - auto-seed from local data
        const localList = await getFileProducts();
        if (localList.length > 0) {
          const seedRows = localList.map((p) => ({
            id: toUuid(p.id),
            name: p.name,
            slug: p.slug,
            category_id: toUuid(p.category_id),
            brand: p.brand,
            description: p.description || '',
            short_description: p.short_description || (p.description ? p.description.slice(0, 160) : ''),
            price: Number(p.price),
            previous_price: p.previous_price ? Number(p.previous_price) : null,
            currency: p.currency || 'NGN',
            stock_status: p.stock_status || 'in_stock',
            quantity: Number(p.quantity ?? 1),
            sku: p.sku,
            condition: p.condition || 'Brand New',
            images: Array.isArray(p.images) ? p.images : [],
            specifications: p.specifications || {},
            is_featured: Boolean(p.is_featured),
            is_published: p.is_published !== false,
            status: p.status || 'published',
            is_archived: Boolean(p.is_archived),
            seo_title: p.seo_title || null,
            seo_description: p.seo_description || null,
          }));
          await db.from('products').upsert(seedRows);
          list = localList;
        }
      }
    } catch (err) {
      console.warn('Supabase products query fallback:', err);
    }
  }

  // Fallback to local files if Supabase is offline or empty
  if (list.length === 0) {
    list = await getFileProducts();
  }

  // Load categories to enrich products with human-readable category_name
  const categories = await getServerCategories(true);
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    categoryMap.set(c.id, c.name);
    categoryMap.set(toUuid(c.id), c.name);
    categoryMap.set(c.slug, c.name);
  }

  list = list.map((p) => ({
    ...p,
    category_name: p.category_name || categoryMap.get(p.category_id) || 'General',
  }));

  // Apply in-memory filtering for complete consistency
  if (!options?.includeArchived && options?.status !== 'archived') {
    list = list.filter((p) => p.status !== 'archived' && !p.is_archived);
  }

  if (options?.status) {
    list = list.filter((p) => p.status === options.status);
  }

  if (options?.publishedOnly !== false && !options?.status && !options?.includeArchived) {
    list = list.filter((p) => p.status === 'published' && p.is_published && !p.is_archived);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }

  if (options?.categorySlug && options.categorySlug !== 'all') {
    const targetCat = categories.find((c) => c.slug === options.categorySlug);
    if (targetCat) {
      const catUuid = toUuid(targetCat.id);
      list = list.filter(
        (p) => p.category_id === targetCat.id || p.category_id === catUuid || p.category_id === targetCat.slug
      );
    }
  }

  if (options?.brand && options.brand !== 'all') {
    list = list.filter((p) => p.brand.toLowerCase() === options.brand!.toLowerCase());
  }

  if (options?.condition && options.condition !== 'all') {
    list = list.filter((p) => p.condition === options.condition);
  }

  if (options?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }

  if (options?.maxPrice !== undefined && options.maxPrice > 0) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options?.stockOnly) {
    list = list.filter((p) => p.stock_status === 'in_stock');
  }

  if (options?.search) {
    const term = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.short_description?.toLowerCase().includes(term) ||
        (p.specifications?.processor && p.specifications.processor.toLowerCase().includes(term)) ||
        (p.specifications?.storage && p.specifications.storage.toLowerCase().includes(term)) ||
        (p.specifications?.ram && p.specifications.ram.toLowerCase().includes(term))
    );
  }

  return list;
}

export async function getServerProductBySlug(slug: string): Promise<Product | null> {
  const db = getDbClient();
  if (isSupabaseConfigured && db) {
    try {
      const { data, error } = await withDbTimeout(
        db.from('products').select('*').eq('slug', slug).maybeSingle(),
        3000
      );
      if (!error && data) {
        const prod = data as Product;
        const categories = await getServerCategories(true);
        prod.category_name = categories.find((c) => c.id === prod.category_id || toUuid(c.id) === prod.category_id)?.name || 'General';
        return prod;
      }
    } catch {}
  }

  const list = await getFileProducts();
  const found = list.find((p) => p.slug === slug);
  if (found) {
    const categories = await getServerCategories(true);
    found.category_name = categories.find((c) => c.id === found.category_id || toUuid(c.id) === found.category_id)?.name || 'General';
    return found;
  }
  return null;
}

export async function getServerProductById(id: string): Promise<Product | null> {
  const db = getDbClient();
  const targetUuid = toUuid(id);

  if (isSupabaseConfigured && db) {
    try {
      const { data, error } = await withDbTimeout(
        db
          .from('products')
          .select('*')
          .or(`id.eq.${targetUuid},id.eq.${id}`)
          .maybeSingle(),
        3000
      );

      if (!error && data) {
        const prod = data as Product;
        const categories = await getServerCategories(true);
        prod.category_name = categories.find((c) => c.id === prod.category_id || toUuid(c.id) === prod.category_id)?.name || 'General';
        return prod;
      }
    } catch {}
  }

  const list = await getFileProducts();
  return list.find((p) => p.id === id || p.id === targetUuid) || null;
}

export async function saveServerProduct(
  productData: Partial<Product> & { name: string; price: number; brand: string }
): Promise<Product> {
  const now = new Date().toISOString();
  const db = getDbClient();

  // Normalize status and publication flags
  const status: ProductStatus = productData.status || (productData.is_published === false ? 'draft' : 'published');
  const is_published = status === 'published';
  const is_archived = status === 'archived';

  // ID and category UUID resolution
  const finalId = productData.id ? toUuid(productData.id) : crypto.randomUUID();
  const finalCategoryUuid = toUuid(productData.category_id || 'cat-laptops');

  // Slug generation
  let finalSlug = productData.slug;
  if (!finalSlug) {
    const baseSlug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.floor(100 + Math.random() * 900);
    finalSlug = `${baseSlug}-${uniqueSuffix}`;
  }

  // Ensure category exists in Supabase so foreign key constraint never fails
  if (isSupabaseConfigured && db) {
    try {
      const { data: existingCat } = await db.from('categories').select('id').eq('id', finalCategoryUuid).maybeSingle();
      if (!existingCat) {
        const catName = productData.category_name || 'Laptops';
        await db.from('categories').upsert({
          id: finalCategoryUuid,
          name: catName,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `${catName} collection`,
          display_order: 1,
          is_archived: false,
        });
      }
    } catch (e) {
      console.warn('Category ensure error:', e);
    }
  }

  // Construct pure Supabase database row (strip virtual frontend attributes like category_name)
  const dbRow = {
    id: finalId,
    name: productData.name,
    slug: finalSlug,
    category_id: finalCategoryUuid,
    brand: productData.brand,
    description: productData.description || '',
    short_description: productData.short_description || productData.description?.slice(0, 160) || '',
    price: Number(productData.price),
    previous_price: productData.previous_price ? Number(productData.previous_price) : null,
    currency: productData.currency || 'NGN',
    stock_status: productData.stock_status || 'in_stock',
    quantity: Number(productData.quantity ?? 1),
    sku: productData.sku || `ET-${Date.now().toString().slice(-6)}`,
    condition: productData.condition || 'Brand New',
    images:
      productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    specifications: productData.specifications || {},
    is_featured: Boolean(productData.is_featured),
    is_published,
    status,
    is_archived,
    seo_title: productData.seo_title || `${productData.name} | ExperienceTech Aba`,
    seo_description:
      productData.seo_description ||
      productData.short_description ||
      `Buy ${productData.name} in 37B St. Michael Road, Aba, Abia State. Best prices and verified warranty.`,
    created_at: productData.created_at || now,
    updated_at: now,
  };

  // 1. Sync directly to Supabase DB
  if (isSupabaseConfigured && db) {
    try {
      const { error: upsertErr } = await db.from('products').upsert(dbRow);
      if (upsertErr) {
        console.error('Supabase product upsert error:', upsertErr);
      }
    } catch (err) {
      console.error('Supabase product upsert exception:', err);
    }
  }

  // 2. Also keep local files synchronized for redundancy and instant local reads
  const fileProducts = await getFileProducts();
  const fileIdx = fileProducts.findIndex((p) => p.id === finalId || p.id === productData.id);
  const categories = await getServerCategories(true);
  const categoryName =
    productData.category_name ||
    categories.find((c) => c.id === finalCategoryUuid || toUuid(c.id) === finalCategoryUuid)?.name ||
    'Laptops';

  const fullProduct: Product = {
    ...dbRow,
    previous_price: dbRow.previous_price ?? undefined,
    category_name: categoryName,
  };

  if (fileIdx >= 0) {
    fileProducts[fileIdx] = fullProduct;
  } else {
    fileProducts.unshift(fullProduct);
  }
  await saveFileProducts(fileProducts);

  // 3. Trigger Next.js cache revalidation across shop and sitemap
  try {
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${finalSlug}`);
    revalidatePath('/admin/products');
    revalidatePath('/sitemap.xml');
  } catch (err) {
    console.warn('Revalidation warning:', err);
  }

  return fullProduct;
}

export async function archiveServerProduct(id: string): Promise<Product | null> {
  const targetUuid = toUuid(id);
  const now = new Date().toISOString();
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      await db
        .from('products')
        .update({
          status: 'archived',
          is_published: false,
          is_archived: true,
          updated_at: now,
        })
        .or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch (e) {
      console.error('Supabase archive product error:', e);
    }
  }

  const list = await getFileProducts();
  const index = list.findIndex((p) => p.id === id || p.id === targetUuid);
  if (index === -1) return null;

  const updated: Product = {
    ...list[index],
    status: 'archived',
    is_published: false,
    is_archived: true,
    updated_at: now,
  };

  list[index] = updated;
  await saveFileProducts(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${updated.slug}`);
    revalidatePath('/admin/products');
    revalidatePath('/sitemap.xml');
  } catch {}

  return updated;
}

export async function restoreServerProduct(id: string): Promise<Product | null> {
  const targetUuid = toUuid(id);
  const now = new Date().toISOString();
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      await db
        .from('products')
        .update({
          status: 'published',
          is_published: true,
          is_archived: false,
          updated_at: now,
        })
        .or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch (e) {
      console.error('Supabase restore product error:', e);
    }
  }

  const list = await getFileProducts();
  const index = list.findIndex((p) => p.id === id || p.id === targetUuid);
  if (index === -1) return null;

  const updated: Product = {
    ...list[index],
    status: 'published',
    is_published: true,
    is_archived: false,
    updated_at: now,
  };

  list[index] = updated;
  await saveFileProducts(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${updated.slug}`);
    revalidatePath('/admin/products');
    revalidatePath('/sitemap.xml');
  } catch {}

  return updated;
}

export async function deleteServerProduct(id: string, options?: { permanent?: boolean }): Promise<boolean> {
  const targetUuid = toUuid(id);
  const db = getDbClient();

  if (!options?.permanent) {
    const res = await archiveServerProduct(id);
    return !!res;
  }

  if (isSupabaseConfigured && db) {
    try {
      await db.from('products').delete().or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch (e) {
      console.error('Supabase permanent delete product error:', e);
    }
  }

  let list = await getFileProducts();
  const target = list.find((p) => p.id === id || p.id === targetUuid);
  list = list.filter((p) => p.id !== id && p.id !== targetUuid);
  await saveFileProducts(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
    if (target?.slug) {
      revalidatePath(`/shop/${target.slug}`);
    }
    revalidatePath('/admin/products');
    revalidatePath('/sitemap.xml');
  } catch {}

  return true;
}

/* ============================================================
   2. CATEGORIES (SERVER)
   ============================================================ */
export async function getFileCategories(): Promise<Category[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  try {
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(initialCategories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial categories to file:', err);
  }
  return [...initialCategories];
}

export async function saveFileCategories(categories: Category[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (err) {
    // In serverless environments, local JSON write is safely skipped.
  }
}

export async function getServerCategories(includeArchived = false): Promise<Category[]> {
  let list: Category[] = [];
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      let query = db.from('categories').select('*').order('display_order', { ascending: true });
      if (!includeArchived) {
        query = query.neq('is_archived', true);
      }
      const { data, error } = await withDbTimeout(query, 3000);
      if (!error && Array.isArray(data) && data.length > 0) {
        list = data as Category[];
      } else if (!error && Array.isArray(data) && data.length === 0) {
        const local = await getFileCategories();
        if (local.length > 0) {
          const rows = local.map((c, i) => ({
            id: toUuid(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || null,
            image_url: c.image_url || null,
            display_order: c.display_order || i + 1,
            is_archived: Boolean(c.is_archived),
            seo_title: c.seo_title || null,
            seo_description: c.seo_description || null,
          }));
          await db.from('categories').upsert(rows);
          list = local;
        }
      }
    } catch {}
  }

  if (list.length === 0) {
    list = await getFileCategories();
  }

  if (!includeArchived) {
    list = list.filter((c) => !c.is_archived);
  }

  // Calculate dynamic item counts
  const fileProducts = await getFileProducts();
  return list.map((cat) => {
    const catUuid = toUuid(cat.id);
    return {
      ...cat,
      item_count: fileProducts.filter(
        (p) =>
          (p.category_id === cat.id || p.category_id === catUuid || p.category_id === cat.slug) &&
          p.status === 'published' &&
          p.is_published &&
          !p.is_archived
      ).length,
    };
  });
}

export async function saveServerCategory(catData: Partial<Category> & { name: string }): Promise<Category> {
  const list = await getFileCategories();
  const now = new Date().toISOString();
  const db = getDbClient();

  const finalId = catData.id ? toUuid(catData.id) : crypto.randomUUID();
  const slug = (catData.slug || catData.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const saved: Category = {
    id: finalId,
    name: catData.name,
    slug,
    description: catData.description || '',
    image_url:
      catData.image_url ||
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    is_archived: Boolean(catData.is_archived),
    display_order: catData.display_order ?? list.length + 1,
    seo_title: catData.seo_title || `${catData.name} | ExperienceTech Aba`,
    seo_description: catData.seo_description || catData.description || `Browse tested ${catData.name} at ExperienceTech Aba.`,
    created_at: catData.created_at || now,
  };

  const idx = list.findIndex((c) => c.id === finalId || c.id === catData.id);
  if (idx >= 0) {
    list[idx] = saved;
  } else {
    list.push(saved);
  }
  await saveFileCategories(list);

  if (isSupabaseConfigured && db) {
    try {
      await db.from('categories').upsert({
        id: finalId,
        name: saved.name,
        slug: saved.slug,
        description: saved.description || null,
        image_url: saved.image_url || null,
        display_order: saved.display_order || 1,
        is_archived: saved.is_archived,
        seo_title: saved.seo_title || null,
        seo_description: saved.seo_description || null,
      });
    } catch (e) {
      console.error('Supabase category sync error:', e);
    }
  }

  try {
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');
  } catch {}

  return saved;
}

export async function archiveServerCategory(id: string): Promise<Category | null> {
  const targetUuid = toUuid(id);
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      await db.from('categories').update({ is_archived: true }).or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch {}
  }

  const list = await getFileCategories();
  const idx = list.findIndex((c) => c.id === id || c.id === targetUuid);
  if (idx === -1) return null;

  list[idx].is_archived = true;
  await saveFileCategories(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
  } catch {}

  return list[idx];
}

export async function restoreServerCategory(id: string): Promise<Category | null> {
  const targetUuid = toUuid(id);
  const db = getDbClient();

  if (isSupabaseConfigured && db) {
    try {
      await db.from('categories').update({ is_archived: false }).or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch {}
  }

  const list = await getFileCategories();
  const idx = list.findIndex((c) => c.id === id || c.id === targetUuid);
  if (idx === -1) return null;

  list[idx].is_archived = false;
  await saveFileCategories(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
  } catch {}

  return list[idx];
}

export async function deleteServerCategory(id: string, permanent = false): Promise<boolean> {
  const targetUuid = toUuid(id);
  const db = getDbClient();

  if (!permanent) {
    const res = await archiveServerCategory(id);
    return !!res;
  }

  if (isSupabaseConfigured && db) {
    try {
      await db.from('categories').delete().or(`id.eq.${targetUuid},id.eq.${id}`);
    } catch {}
  }

  let list = await getFileCategories();
  list = list.filter((c) => c.id !== id && c.id !== targetUuid);
  await saveFileCategories(list);

  try {
    revalidatePath('/');
    revalidatePath('/shop');
  } catch {}

  return true;
}
