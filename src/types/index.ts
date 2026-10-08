export type ProductCondition = 'Brand New' | 'Certified Pre-Owned' | 'UK Used' | 'Refurbished';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  brand: string;
  description: string;
  short_description: string;
  price: number;
  previous_price?: number;
  currency: string;
  stock_status: StockStatus;
  quantity: number;
  sku: string;
  condition: ProductCondition;
  images: string[];
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    gpu?: string;
    os?: string;
    battery?: string;
    warranty?: string;
    ports?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  is_featured: boolean;
  is_published: boolean;
  status: ProductStatus;
  is_archived?: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  item_count?: number;
  is_archived?: boolean;
  display_order?: number;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price_starting_at: number;
  turnaround_time: string;
  features: string[];
  icon: string;
  is_published: boolean;
}

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed' | 'Cancelled';

export interface RepairRequest {
  id: string;
  tracking_code: string;
  customer_name: string;
  phone: string;
  email: string;
  device_type: 'Laptop' | 'Desktop' | 'MacBook' | 'Workstation' | 'Monitor' | 'Other';
  device_brand: string;
  device_model?: string;
  problem_description: string;
  preferred_date: string;
  preferred_contact_method: 'WhatsApp' | 'Phone Call' | 'Email';
  status: LeadStatus;
  notes?: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  type: 'product' | 'general' | 'service';
  product_id?: string;
  product_name?: string;
  customer_name: string;
  phone: string;
  email: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export type TrainingStatus = 'Coming Soon' | 'Currently in Development' | 'Registration Open' | 'Registration Closed';

export interface TrainingModule {
  id: string;
  title: string;
  duration?: string;
  topics: string[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  slug: string;
  status: TrainingStatus;
  overview: string;
  duration: string;
  delivery_format: string;
  target_audience: string[];
  modules: TrainingModule[];
  instructor_bio: string;
  expected_launch: string;
  estimated_fee?: string;
  is_published: boolean;
}

export interface TrainingRegistration {
  id: string;
  program_id: string;
  full_name: string;
  email: string;
  phone: string;
  occupation: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Archived';
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  verified: boolean;
  avatar?: string;
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Products' | 'Repairs' | 'Training' | 'General';
  is_published: boolean;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  phone_display: string;
  whatsapp_number: string;
  whatsapp_display: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  opening_hours: string;
  google_maps_url: string;
  google_maps_embed_url: string;
  google_business_profile_url: string;
  facebook_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entity_id?: string;
  user: string;
  details: string;
  timestamp: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name: 
    | 'page_view'
    | 'product_view'
    | 'whatsapp_product_enquiry'
    | 'whatsapp_general_enquiry'
    | 'whatsapp_cta_click'
    | 'phone_click'
    | 'email_click'
    | 'repair_request'
    | 'training_registration'
    | 'contact_submission'
    | 'product_enquiry_click'
    | 'service_enquiry_click'
    | 'main_cta_click'
    | 'google_reviews_click'
    | 'search';
  metadata: Record<string, any>;
  created_at: string;
}
