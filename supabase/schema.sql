-- ExperienceTech Database Schema
-- Production PostgreSQL DDL for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL DEFAULT 'ExperienceTech',
    tagline TEXT NOT NULL DEFAULT 'Your Trusted Technology Partner',
    phone TEXT NOT NULL DEFAULT '+2348021234567',
    phone_display TEXT NOT NULL DEFAULT '+234 802 123 4567',
    whatsapp_number TEXT NOT NULL DEFAULT '2348021234567',
    whatsapp_display TEXT NOT NULL DEFAULT '+234 802 123 4567',
    email TEXT NOT NULL DEFAULT 'experiencetechservices@gmail.com',
    address TEXT NOT NULL DEFAULT 'Suite 14, Tech Plaza, St. Michael Road, 37B St. Michael Road, Aba, Abia State',
    city TEXT NOT NULL DEFAULT 'Aba',
    state TEXT NOT NULL DEFAULT 'Aba State',
    country TEXT NOT NULL DEFAULT 'Nigeria',
    opening_hours TEXT NOT NULL DEFAULT 'Monday - Saturday: 8:30 AM - 6:30 PM (Sunday Closed)',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Computer+Village+Aba+Aba',
    google_maps_embed_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3524958134267!2d3.339247!3d6.598583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9228d44208a7%3A0x6b7d5ee461e7dcad!2sComputer%20Village%2C%20Aba%2C%20Aba!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',
    google_business_profile_url TEXT NOT NULL DEFAULT 'https://business.google.com/',
    facebook_url TEXT DEFAULT 'https://facebook.com/experiencetechng',
    instagram_url TEXT DEFAULT 'https://instagram.com/experiencetechng',
    twitter_url TEXT DEFAULT 'https://twitter.com/experiencetechng',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/company/experiencetechng',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    brand TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    previous_price NUMERIC(12, 2),
    currency TEXT NOT NULL DEFAULT 'NGN',
    stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'pre_order')),
    quantity INT NOT NULL DEFAULT 1,
    sku TEXT NOT NULL UNIQUE,
    condition TEXT NOT NULL DEFAULT 'Brand New' CHECK (condition IN ('Brand New', 'Certified Pre-Owned', 'UK Used', 'Refurbished')),
    images TEXT[] NOT NULL DEFAULT '{}',
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_archived BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    price_starting_at NUMERIC(12, 2) NOT NULL DEFAULT 0,
    turnaround_time TEXT NOT NULL DEFAULT 'Same Day / 24 Hours',
    features TEXT[] NOT NULL DEFAULT '{}',
    icon TEXT NOT NULL DEFAULT 'Wrench',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REPAIR REQUESTS TABLE
CREATE TABLE IF NOT EXISTS repair_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    device_type TEXT NOT NULL,
    device_brand TEXT NOT NULL,
    device_model TEXT,
    problem_description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_contact_method TEXT NOT NULL DEFAULT 'WhatsApp',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Converted', 'Closed', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('product', 'general', 'service')),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Converted', 'Closed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRAINING PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'Currently in Development' CHECK (status IN ('Coming Soon', 'Currently in Development', 'Registration Open', 'Registration Closed')),
    overview TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '8 Weeks (Weekend Intensive)',
    delivery_format TEXT NOT NULL DEFAULT 'Hybrid: Online Modules + Hands-on Lab Sessions (Aba)',
    target_audience TEXT[] NOT NULL DEFAULT '{}',
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructor_bio TEXT NOT NULL,
    expected_launch TEXT NOT NULL DEFAULT 'Q2 2026',
    estimated_fee TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TRAINING REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS training_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    occupation TEXT NOT NULL,
    experience_level TEXT NOT NULL CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
    goal TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Enrolled', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true,
    avatar TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Products', 'Repairs', 'Training', 'General')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    "user" TEXT NOT NULL DEFAULT 'Admin',
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public READ access for published customer-facing content
CREATE POLICY "Public can view business settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published training" ON training_programs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published faqs" ON faqs FOR SELECT USING (is_published = true);

-- Public INSERT access for customer leads & analytics
CREATE POLICY "Public can create repair requests" ON repair_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit training interest" ON training_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can log analytics events" ON analytics_events FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full Access
CREATE POLICY "Admin full access business_settings" ON business_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access brands" ON brands FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access repair_requests" ON repair_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access enquiries" ON enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access training_programs" ON training_programs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access training_registrations" ON training_registrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access activity_logs" ON activity_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access analytics_events" ON analytics_events FOR ALL TO authenticated USING (true);
