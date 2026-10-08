# ExperienceTech — E-commerce, Repairs & Training Platform

Production-ready web platform for **ExperienceTech**, a premier Nigerian technology retail and engineering enterprise based in 37B St. Michael Road, Aba, Abia State.

---

## 🚀 Key Highlights & Architecture

- **E-Commerce & Catalog**: High-performance catalogue for Brand New and Grade A UK-used laptops, components, and accessories with multi-criteria filtering, search, and dynamic pricing in Naira (₦).
- **Contextual WhatsApp Conversion System**: Generates custom pre-filled WhatsApp consultation and order messages containing product SKU, price, and customer inquiry intent without manual typing.
- **Smart Sales UX / Laptop Finder**: Guided recommendation wizard matching buyer workflows (programming, design, accounting, students, gaming) to tested hardware models.
- **Workshop Intake & Repair Booking**: Comprehensive service scheduling with tracking code generation (e.g., `ET-REP-XXXXX`), status pipeline, and direct WhatsApp continuation.
- **Training Academy Waitlist**: Transparent "Currently in Development" state allowing prospective students to register their interest for hardware engineering and diagnostic cohorts.
- **Full Admin CMS Portal**:
  - Products & Inventory CRUD (multi-tab editor for commercial pricing, stock, technical specifications, gallery, and custom SEO).
  - Repair requests pipeline (New, Contacted, In Progress, Converted, Closed, Cancelled).
  - Enquiries & quote lead manager.
  - Training status switcher and waitlist database.
  - Services manager.
  - Business settings manager (NAP, phone, WhatsApp desk, Google Maps embed, Google Business Profile URL).
  - Activity log audit trail.
  - Conversion telemetry & analytics (WhatsApp clicks, phone clicks, product views).
- **SEO & Local Discovery**:
  - JSON-LD Structured Data: `LocalBusiness`, `Product` with `Offer`, `BreadcrumbList`, `WebSite`, `FAQPage`.
  - Dynamic `sitemap.xml` and `robots.txt`.
  - OpenGraph social sharing meta tags.
- **Dual Supabase + Resilient Fallback Layer**:
  - Full PostgreSQL DDL in `supabase/schema.sql` with Row Level Security (RLS) policies.
  - Functions cleanly with or without live Supabase API keys via stateful persistent storage.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables (Navy Blue & Crisp White brand palette)
- **Icons**: Lucide React
- **Database / Auth**: Supabase (PostgreSQL) + Unified Local Data Repository
- **Deployment Target**: Vercel

---

## 🔐 Staff Portal Access & Credentials

Staff access can be reached either by clicking any of the **Staff Portal** (🔒 Lock icon) entry points located in the **Top Utility Bar**, the **Header Actions**, the **Mobile Drawer**, or the **Footer**, or by navigating directly to the login URL:

- **Login URL**: [`/admin/login`](http://localhost:3000/admin/login)
- **Staff Email**: `experiencetechservices@gmail.com` *(or any authorized staff email)*
- **Staff Password**: `ExperienceTech2026!` or `admin2026!`

*(All `/admin/*` dashboard pages are protected and automatically redirect unauthenticated visits to `/admin/login`).*

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:

```bash
# Supabase Configuration (Optional for initial demo, required for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp & Business Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=2348133948068
NEXT_PUBLIC_BUSINESS_PHONE=+2348133948068
NEXT_PUBLIC_BUSINESS_EMAIL=experiencetechservices@gmail.com

# Production URL
NEXT_PUBLIC_SITE_URL=https://experiencetech.ng
```

---

## 🗄️ Supabase Database Migration

1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** in your project.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Copy your **Project URL** and **Anon API Key** into your `.env.local` or Vercel environment variables.

---

## 🌐 Deploying to Vercel with Namecheap Domain

1. Push this repository to GitHub or GitLab.
2. Log into [Vercel](https://vercel.com) and click **"Import Project"**.
3. Add the environment variables from your `.env.local`.
4. Deploy the project.
5. In your Vercel Project Dashboard, navigate to **Settings > Domains**.
6. Enter your custom Namecheap domain (e.g. `experiencetech.ng` and `www.experiencetech.ng`).
7. In your **Namecheap Dashboard**:
   - Go to **Domain List > Manage > Advanced DNS**.
   - For the root domain (`@`), create an **A Record** pointing to `76.76.21.21`.
   - For `www`, create a **CNAME Record** pointing to `cname.vercel-dns.com`.
8. Once DNS propagates, Vercel automatically issues an SSL certificate for HTTPS.

---

## 📍 Google Search Console & Google Business Profile Setup

1. **Google Search Console**:
   - Add property: `https://experiencetech.ng`.
   - Verify ownership via DNS TXT record in Namecheap or HTML tag.
   - Submit sitemap URL: `https://experiencetech.ng/sitemap.xml`.
2. **Google Business Profile**:
   - Create or claim your business at `https://business.google.com`.
   - Ensure the business name (*ExperienceTech*), phone number, physical address (37B St. Michael Road, Aba, Abia State), and opening hours match the NAP details configured in `/admin/settings`.
   - Paste your verified profile link into the **Google Business Profile URL** field in `/admin/settings`.
