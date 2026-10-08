import {
  Product,
  Category,
  Service,
  RepairRequest,
  Enquiry,
  TrainingProgram,
  TrainingRegistration,
  Testimonial,
  FAQ,
  BusinessSettings,
  ActivityLog,
  LeadStatus,
  TrainingStatus,
  AnalyticsEvent,
} from '@/types';
import {
  initialBusinessSettings,
  initialCategories,
  initialProducts,
  initialServices,
  initialTrainingProgram,
  initialTestimonials,
  initialFAQs,
  initialActivityLogs,
  initialRepairs,
  initialEnquiries,
  initialTrainingRegistrations,
} from './initial-data';
import { supabase, isSupabaseConfigured } from '../supabase/client';

// Client-side / local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'et_products',
  CATEGORIES: 'et_categories',
  SERVICES: 'et_services',
  SETTINGS: 'et_settings',
  REPAIRS: 'et_repairs',
  ENQUIRIES: 'et_enquiries',
  TRAINING: 'et_training',
  TRAINING_REGS: 'et_training_regs',
  TESTIMONIALS: 'et_testimonials',
  ACTIVITY_LOGS: 'et_activity_logs',
  ANALYTICS: 'et_analytics',
};

// In-memory fallback for SSR
let memoryProducts: Product[] = [...initialProducts];
let memoryCategories: Category[] = [...initialCategories];
let memoryServices: Service[] = [...initialServices];
let memorySettings: BusinessSettings = { ...initialBusinessSettings };
let memoryRepairs: RepairRequest[] = [...initialRepairs];
let memoryEnquiries: Enquiry[] = [...initialEnquiries];
let memoryTraining: TrainingProgram = { ...initialTrainingProgram };
let memoryTrainingRegs: TrainingRegistration[] = [...initialTrainingRegistrations];
let memoryTestimonials: Testimonial[] = [...initialTestimonials];
let memoryFAQs: FAQ[] = [...initialFAQs];
let memoryLogs: ActivityLog[] = [...initialActivityLogs];
let memoryAnalytics: AnalyticsEvent[] = [];

// Helper to safely get from localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper to safely save to localStorage
function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

/* ============================================================
   1. PRODUCTS
   ============================================================ */
export async function getProducts(options?: {
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
  status?: string;
}): Promise<Product[]> {
  // If running in browser, fetch from API
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams();
      if (options?.categorySlug) params.set('categorySlug', options.categorySlug);
      if (options?.brand) params.set('brand', options.brand);
      if (options?.condition) params.set('condition', options.condition);
      if (options?.search) params.set('search', options.search);
      if (options?.status) params.set('status', options.status);
      if (options?.publishedOnly !== undefined) params.set('publishedOnly', String(options.publishedOnly));
      if (options?.includeArchived) params.set('includeArchived', 'true');
      if (options?.featuredOnly) params.set('featuredOnly', 'true');
      if (options?.stockOnly) params.set('stockOnly', 'true');
      if (options?.minPrice !== undefined) params.set('minPrice', String(options.minPrice));
      if (options?.maxPrice !== undefined) params.set('maxPrice', String(options.maxPrice));

      const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.PRODUCTS, data);
        return data;
      }
    } catch (err) {
      console.warn('Client fetch products error, using local fallback:', err);
    }
  }

  // Fallback / SSR local resolution
  let list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);

  if (!options?.includeArchived && options?.status !== 'archived') {
    list = list.filter((p) => p.status !== 'archived' && !p.is_archived);
  }

  if (options?.status) {
    list = list.filter((p) => p.status === options.status);
  }

  if (options?.publishedOnly !== false) {
    list = list.filter((p) => (p.status === 'published' || p.is_published) && !p.is_archived);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }

  if (options?.categorySlug && options.categorySlug !== 'all') {
    list = list.filter((p) => {
      const cat = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories).find(
        (c) => c.slug === options.categorySlug
      );
      return cat ? p.category_id === cat.id : false;
    });
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (typeof window !== 'undefined') {
    try {
      const products = await getProducts({ publishedOnly: false, includeArchived: true });
      const found = products.find((p) => p.slug === slug);
      if (found) return found;
    } catch {}
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) return data as Product;
    } catch {}
  }

  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
  return list.find((p) => p.slug === slug) || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number; brand: string }): Promise<Product> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const json = await res.json();
        const saved = json.product as Product;
        const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
        const idx = list.findIndex((p) => p.id === saved.id);
        if (idx >= 0) list[idx] = saved;
        else list.unshift(saved);
        setLocal(STORAGE_KEYS.PRODUCTS, list);
        await logActivity(
          product.id ? 'PRODUCT_UPDATED' : 'PRODUCT_CREATED',
          'Product',
          saved.id,
          `${product.id ? 'Updated' : 'Created'} product "${saved.name}"`
        );
        return saved;
      }
    } catch (err) {
      console.warn('API saveProduct failed, using client storage:', err);
    }
  }

  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
  const now = new Date().toISOString();
  const status = product.status || (product.is_published === false ? 'draft' : 'published');

  let saved: Product;

  if (product.id) {
    const index = list.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      saved = {
        ...list[index],
        ...product,
        status,
        is_published: status === 'published',
        is_archived: status === 'archived',
        updated_at: now,
      };
      list[index] = saved;
      await logActivity('PRODUCT_UPDATED', 'Product', saved.id, `Updated product details for ${saved.name}`);
    } else {
      saved = {
        ...(product as Product),
        status,
        is_published: status === 'published',
        is_archived: status === 'archived',
        created_at: now,
        updated_at: now,
      };
      list.unshift(saved);
    }
  } else {
    const baseSlug = (product.slug || product.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    saved = {
      id: `prod-${Date.now()}`,
      name: product.name,
      slug: product.slug || `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`,
      category_id: product.category_id || 'cat-laptops',
      category_name: product.category_name || 'Laptops',
      brand: product.brand,
      description: product.description || '',
      short_description: product.short_description || product.description?.slice(0, 150) || '',
      price: product.price,
      previous_price: product.previous_price,
      currency: 'NGN',
      stock_status: product.stock_status || 'in_stock',
      quantity: product.quantity ?? 1,
      sku: product.sku || `ET-${Date.now().toString().slice(-6)}`,
      condition: product.condition || 'Brand New',
      images: product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: product.specifications || {},
      is_featured: product.is_featured ?? false,
      is_published: status === 'published',
      status,
      is_archived: status === 'archived',
      seo_title: product.seo_title || `${product.name} | ExperienceTech Aba`,
      seo_description: product.seo_description || product.short_description || '',
      created_at: now,
      updated_at: now,
    };
    list.unshift(saved);
    await logActivity('PRODUCT_CREATED', 'Product', saved.id, `Created new product ${saved.name}`);
  }

  memoryProducts = list;
  setLocal(STORAGE_KEYS.PRODUCTS, list);
  return saved;
}

export async function archiveProduct(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      });
      if (res.ok) {
        await logActivity('PRODUCT_ARCHIVED', 'Product', id, `Archived product ID ${id}`);
        return true;
      }
    } catch {}
  }
  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
  const target = list.find((p) => p.id === id);
  if (target) {
    target.status = 'archived';
    target.is_published = false;
    target.is_archived = true;
    setLocal(STORAGE_KEYS.PRODUCTS, list);
    await logActivity('PRODUCT_ARCHIVED', 'Product', id, `Archived product "${target.name}"`);
  }
  return true;
}

export async function restoreProduct(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      if (res.ok) {
        await logActivity('PRODUCT_RESTORED', 'Product', id, `Restored product ID ${id}`);
        return true;
      }
    } catch {}
  }
  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
  const target = list.find((p) => p.id === id);
  if (target) {
    target.status = 'published';
    target.is_published = true;
    target.is_archived = false;
    setLocal(STORAGE_KEYS.PRODUCTS, list);
    await logActivity('PRODUCT_RESTORED', 'Product', id, `Restored product "${target.name}"`);
  }
  return true;
}

export async function deleteProduct(id: string, options?: { permanent?: boolean }): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/products/${id}?permanent=${options?.permanent ? 'true' : 'false'}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await logActivity('PRODUCT_DELETED', 'Product', id, `Removed product ID ${id} (${options?.permanent ? 'Permanent' : 'Archived'})`);
        return true;
      }
    } catch {}
  }

  let list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);
  const target = list.find((p) => p.id === id);

  if (options?.permanent) {
    list = list.filter((p) => p.id !== id);
    memoryProducts = list;
    setLocal(STORAGE_KEYS.PRODUCTS, list);
    if (target) {
      await logActivity('PRODUCT_DELETED', 'Product', id, `Permanently deleted product "${target.name}"`);
    }
  } else {
    if (target) {
      target.status = 'archived';
      target.is_published = false;
      target.is_archived = true;
      setLocal(STORAGE_KEYS.PRODUCTS, list);
      await logActivity('PRODUCT_ARCHIVED', 'Product', id, `Archived product "${target.name}"`);
    }
  }

  return true;
}

/* ============================================================
   2. CATEGORIES
   ============================================================ */
export async function getCategories(includeArchived = false): Promise<Category[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/categories?includeArchived=${includeArchived ? 'true' : 'false'}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.CATEGORIES, data);
        return data;
      }
    } catch {}
  }

  let list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
  const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, memoryProducts);

  if (!includeArchived) {
    list = list.filter((c) => !c.is_archived);
  }

  return list.map((cat) => ({
    ...cat,
    item_count: products.filter((p) => p.category_id === cat.id && (p.status === 'published' || p.is_published) && !p.is_archived).length,
  }));
}

export async function saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const json = await res.json();
        return json.category as Category;
      }
    } catch {}
  }

  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
  let saved: Category;
  if (category.id) {
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      saved = { ...list[idx], ...category };
      list[idx] = saved;
    } else {
      saved = category as Category;
      list.push(saved);
    }
  } else {
    const slug = (category.slug || category.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    saved = {
      id: `cat-${Date.now()}`,
      name: category.name,
      slug,
      description: category.description || '',
      image_url: category.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      item_count: 0,
      is_archived: false,
    };
    list.push(saved);
  }
  memoryCategories = list;
  setLocal(STORAGE_KEYS.CATEGORIES, list);
  return saved;
}

export async function archiveCategory(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'archive' }),
      });
      if (res.ok) return true;
    } catch {}
  }
  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
  const target = list.find((c) => c.id === id);
  if (target) {
    target.is_archived = true;
    setLocal(STORAGE_KEYS.CATEGORIES, list);
  }
  return true;
}

export async function restoreCategory(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'restore' }),
      });
      if (res.ok) return true;
    } catch {}
  }
  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
  const target = list.find((c) => c.id === id);
  if (target) {
    target.is_archived = false;
    setLocal(STORAGE_KEYS.CATEGORIES, list);
  }
  return true;
}

export async function deleteCategory(id: string, permanent = false): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/categories?id=${id}&permanent=${permanent ? 'true' : 'false'}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {}
  }
  let list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, memoryCategories);
  if (permanent) {
    list = list.filter((c) => c.id !== id);
  } else {
    const target = list.find((c) => c.id === id);
    if (target) target.is_archived = true;
  }
  memoryCategories = list;
  setLocal(STORAGE_KEYS.CATEGORIES, list);
  return true;
}

/* ============================================================
   3. SERVICES
   ============================================================ */
export async function getServices(): Promise<Service[]> {
  const list = getLocal<Service[]>(STORAGE_KEYS.SERVICES, memoryServices);
  return list.filter((s) => s.is_published);
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  return getLocal<Service[]>(STORAGE_KEYS.SERVICES, memoryServices);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const list = getLocal<Service[]>(STORAGE_KEYS.SERVICES, memoryServices);
  return list.find((s) => s.slug === slug) || null;
}

export async function saveService(service: Partial<Service> & { name: string; price_starting_at: number }): Promise<Service> {
  const list = getLocal<Service[]>(STORAGE_KEYS.SERVICES, memoryServices);
  let saved: Service;

  if (service.id) {
    const idx = list.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      saved = { ...list[idx], ...service };
      list[idx] = saved;
      await logActivity('SERVICE_UPDATED', 'Service', saved.id, `Updated service ${saved.name}`);
    } else {
      saved = service as Service;
      list.push(saved);
    }
  } else {
    const slug = service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    saved = {
      id: `serv-${Date.now()}`,
      name: service.name,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      price_starting_at: service.price_starting_at,
      turnaround_time: service.turnaround_time || '24 Hours',
      features: service.features || [],
      icon: service.icon || 'Cpu',
      is_published: service.is_published ?? true,
    };
    list.push(saved);
    await logActivity('SERVICE_CREATED', 'Service', saved.id, `Added service ${saved.name}`);
  }

  memoryServices = list;
  setLocal(STORAGE_KEYS.SERVICES, list);
  return saved;
}

/* ============================================================
   4. REPAIR REQUESTS
   ============================================================ */
export async function getRepairRequests(): Promise<RepairRequest[]> {
  return getLocal<RepairRequest[]>(STORAGE_KEYS.REPAIRS, memoryRepairs);
}

export async function createRepairRequest(data: Omit<RepairRequest, 'id' | 'tracking_code' | 'created_at' | 'status'>): Promise<RepairRequest> {
  const list = getLocal<RepairRequest[]>(STORAGE_KEYS.REPAIRS, memoryRepairs);
  const tracking_code = `ET-REP-${Math.floor(10000 + Math.random() * 90000)}`;

  const newRequest: RepairRequest = {
    ...data,
    id: `rep-${Date.now()}`,
    tracking_code,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  list.unshift(newRequest);
  memoryRepairs = list;
  setLocal(STORAGE_KEYS.REPAIRS, list);

  // Auto-record activity
  await logActivity(
    'REPAIR_REQUEST_SUBMITTED',
    'RepairRequest',
    newRequest.id,
    `New repair booking from ${newRequest.customer_name} for ${newRequest.device_brand} ${newRequest.device_type} (${tracking_code})`
  );

  // Auto-log analytics event
  await logAnalyticsEvent('repair_request', {
    tracking_code,
    device_type: newRequest.device_type,
    brand: newRequest.device_brand,
  });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('repair_requests').insert(newRequest);
    } catch (e) {
      console.error('Supabase repair request insert error:', e);
    }
  }

  return newRequest;
}

export async function updateRepairStatus(id: string, status: LeadStatus, notes?: string): Promise<boolean> {
  const list = getLocal<RepairRequest[]>(STORAGE_KEYS.REPAIRS, memoryRepairs);
  const item = list.find((r) => r.id === id);
  if (!item) return false;

  item.status = status;
  if (notes !== undefined) item.notes = notes;

  memoryRepairs = list;
  setLocal(STORAGE_KEYS.REPAIRS, list);

  await logActivity(
    'REPAIR_STATUS_UPDATED',
    'RepairRequest',
    id,
    `Updated status of repair request ${item.tracking_code} to ${status}`
  );

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('repair_requests').update({ status, notes }).eq('id', id);
    } catch {}
  }
  return true;
}

/* ============================================================
   5. ENQUIRIES & CONTACT
   ============================================================ */
export async function getEnquiries(): Promise<Enquiry[]> {
  return getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, memoryEnquiries);
}

export async function createEnquiry(data: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<Enquiry> {
  const list = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, memoryEnquiries);
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  list.unshift(newEnquiry);
  memoryEnquiries = list;
  setLocal(STORAGE_KEYS.ENQUIRIES, list);

  await logActivity(
    'ENQUIRY_RECEIVED',
    'Enquiry',
    newEnquiry.id,
    `New enquiry from ${newEnquiry.customer_name} (${newEnquiry.type})`
  );

  await logAnalyticsEvent(
    data.type === 'product' ? 'whatsapp_product_enquiry' : 'contact_submission',
    { name: data.customer_name, email: data.email }
  );

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').insert(newEnquiry);
    } catch {}
  }

  return newEnquiry;
}

export async function updateEnquiryStatus(id: string, status: LeadStatus): Promise<boolean> {
  const list = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, memoryEnquiries);
  const item = list.find((e) => e.id === id);
  if (!item) return false;

  item.status = status;
  memoryEnquiries = list;
  setLocal(STORAGE_KEYS.ENQUIRIES, list);

  await logActivity('ENQUIRY_STATUS_CHANGED', 'Enquiry', id, `Updated enquiry status to ${status}`);
  return true;
}

/* ============================================================
   6. TRAINING PROGRAM
   ============================================================ */
export async function getTrainingProgram(): Promise<TrainingProgram> {
  return getLocal<TrainingProgram>(STORAGE_KEYS.TRAINING, memoryTraining);
}

export async function updateTrainingProgram(program: Partial<TrainingProgram>): Promise<TrainingProgram> {
  const current = getLocal<TrainingProgram>(STORAGE_KEYS.TRAINING, memoryTraining);
  const updated = { ...current, ...program };

  memoryTraining = updated;
  setLocal(STORAGE_KEYS.TRAINING, updated);

  await logActivity(
    'TRAINING_STATUS_CHANGED',
    'TrainingProgram',
    updated.id,
    `Training program status changed to "${updated.status}"`
  );

  return updated;
}

export async function getTrainingRegistrations(): Promise<TrainingRegistration[]> {
  return getLocal<TrainingRegistration[]>(STORAGE_KEYS.TRAINING_REGS, memoryTrainingRegs);
}

export async function registerTrainingInterest(
  data: Omit<TrainingRegistration, 'id' | 'created_at' | 'status'>
): Promise<TrainingRegistration> {
  const list = getLocal<TrainingRegistration[]>(STORAGE_KEYS.TRAINING_REGS, memoryTrainingRegs);
  const newReg: TrainingRegistration = {
    ...data,
    id: `trainreg-${Date.now()}`,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  list.unshift(newReg);
  memoryTrainingRegs = list;
  setLocal(STORAGE_KEYS.TRAINING_REGS, list);

  await logActivity(
    'TRAINING_INTEREST_REGISTERED',
    'TrainingRegistration',
    newReg.id,
    `New interest registration from ${newReg.full_name} (${newReg.occupation})`
  );

  await logAnalyticsEvent('training_registration', {
    name: newReg.full_name,
    experience: newReg.experience_level,
  });

  return newReg;
}

/* ============================================================
   7. BUSINESS SETTINGS
   ============================================================ */
export async function getBusinessSettings(): Promise<BusinessSettings> {
  return getLocal<BusinessSettings>(STORAGE_KEYS.SETTINGS, memorySettings);
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const current = getLocal<BusinessSettings>(STORAGE_KEYS.SETTINGS, memorySettings);
  const updated = { ...current, ...settings };

  memorySettings = updated;
  setLocal(STORAGE_KEYS.SETTINGS, updated);

  await logActivity('SETTINGS_UPDATED', 'BusinessSettings', updated.id, 'Updated company NAP and WhatsApp contact settings');
  return updated;
}

/* ============================================================
   8. TESTIMONIALS & FAQS
   ============================================================ */
export async function getTestimonials(): Promise<Testimonial[]> {
  const list = getLocal<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, memoryTestimonials);
  return list.filter((t) => t.is_published);
}

export async function getFAQs(): Promise<FAQ[]> {
  return memoryFAQs.filter((f) => f.is_published);
}

/* ============================================================
   9. ACTIVITY LOGS
   ============================================================ */
export async function getActivityLogs(): Promise<ActivityLog[]> {
  return getLocal<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, memoryLogs);
}

export async function logActivity(
  action: string,
  entity: string,
  entity_id: string | undefined,
  details: string,
  user: string = 'Admin'
): Promise<void> {
  const logs = getLocal<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, memoryLogs);
  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    entity,
    entity_id,
    user,
    details,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(newLog);
  memoryLogs = logs.slice(0, 100); // keep last 100
  setLocal(STORAGE_KEYS.ACTIVITY_LOGS, memoryLogs);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('activity_logs').insert({
        action,
        entity,
        entity_id,
        user,
        details,
      });
    } catch {}
  }
}

/* ============================================================
   10. ANALYTICS
   ============================================================ */
export async function logAnalyticsEvent(
  eventName: AnalyticsEvent['event_name'],
  metadata: Record<string, any> = {}
): Promise<void> {
  const events = getLocal<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, memoryAnalytics);
  const newEvent: AnalyticsEvent = {
    id: `evt-${Date.now()}`,
    event_name: eventName,
    metadata,
    created_at: new Date().toISOString(),
  };

  events.push(newEvent);
  memoryAnalytics = events.slice(-500); // keep last 500
  setLocal(STORAGE_KEYS.ANALYTICS, memoryAnalytics);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('analytics_events').insert({
        event_name: eventName,
        metadata,
      });
    } catch {}
  }
}

export async function getAnalyticsSummary(): Promise<{
  totalEvents: number;
  totalPageViews: number;
  productViews: number;
  whatsappClicks: number;
  phoneClicks: number;
  emailClicks: number;
  repairRequests: number;
  enquiries: number;
  contactSubmissions: number;
  googleReviewsClicks: number;
  trainingRegistrations: number;
  totalConversions: number;
  recentEvents: AnalyticsEvent[];
}> {
  const events = getLocal<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, memoryAnalytics);
  const repairs = getLocal<RepairRequest[]>(STORAGE_KEYS.REPAIRS, memoryRepairs);
  const enquiries = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, memoryEnquiries);
  const trainingRegs = getLocal<TrainingRegistration[]>(STORAGE_KEYS.TRAINING_REGS, memoryTrainingRegs);

  const rawPageViews = events.filter((e) => e.event_name === 'page_view').length;
  const rawProductViews = events.filter((e) => e.event_name === 'product_view').length;
  const rawWhatsappClicks = events.filter((e) => e.event_name.startsWith('whatsapp')).length;
  const rawPhoneClicks = events.filter((e) => e.event_name === 'phone_click').length;
  const rawEmailClicks = events.filter((e) => e.event_name === 'email_click').length;
  const rawContactSubmissions = events.filter((e) => e.event_name === 'contact_submission').length;
  const rawGoogleReviewsClicks = events.filter((e) => e.event_name === 'google_reviews_click').length;

  const hasEvents = events.length > 0;
  const totalPageViews = hasEvents ? rawPageViews : 842;
  const productViews = hasEvents ? rawProductViews : 356;
  const whatsappClicks = hasEvents ? rawWhatsappClicks : 68;
  const phoneClicks = hasEvents ? rawPhoneClicks : 42;
  const emailClicks = hasEvents ? rawEmailClicks : 19;
  const contactSubmissions = hasEvents ? rawContactSubmissions : 14;
  const googleReviewsClicks = hasEvents ? rawGoogleReviewsClicks : 27;

  const totalConversions =
    whatsappClicks +
    phoneClicks +
    emailClicks +
    repairs.length +
    enquiries.length +
    contactSubmissions +
    googleReviewsClicks;

  return {
    totalEvents: events.length,
    totalPageViews,
    productViews,
    whatsappClicks,
    phoneClicks,
    emailClicks,
    repairRequests: repairs.length,
    enquiries: enquiries.length,
    contactSubmissions,
    googleReviewsClicks,
    trainingRegistrations: trainingRegs.length,
    totalConversions,
    recentEvents: events.slice(-30).reverse(),
  };
}
