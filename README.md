# ATELIER DU CAFÉ — Premium Coffee Machine E-Commerce Platform

> A production-ready, luxury editorial e-commerce platform and equipment catalog inspired by the visual design principles of [lifetimedesign.co](https://lifetimedesign.co/) (generous whitespace, strong editorial typography, oversized imagery, asymmetric layouts, and dual conversion flows: Direct Payment Checkout & WhatsApp-Assisted Sales).

---

## 🏛️ System Architecture

The application is engineered as a clean, decoupled **Monorepo**:

```
coffee-commerce/
├── apps/
│   ├── web/                     # Luxury Storefront (Next.js App Router, Tailwind, Zustand)
│   ├── admin/                   # Operations Control Center (Next.js, Tailwind, Metrics)
│   └── api/                     # High-performance REST API (NestJS, Prisma, Swagger, JWT)
├── packages/
│   ├── types/                   # Shared TypeScript DTOs, Enums, Interfaces
│   ├── config/                  # Shared Tailwind, PostCSS, ESLint configs
│   └── ui/                      # Shared design tokens & UI components
├── prisma/
│   ├── schema.prisma            # PostgreSQL & SQLite compatible Prisma Schema
│   └── seed.ts                  # Real-world 20+ machine seed data (La Marzocco, Rocket, etc.)
├── docker/
│   └── docker-compose.yml       # Docker orchestration (Postgres, Redis, API, Web, Admin)
└── docs/                        # Complete technical documentation suite
```

---

## 🚀 Key Features

### ☕ Storefront (`apps/web`)
- **Luxury Editorial Aesthetic**: Warm palette (`#FDFBF7` cream, `#1A1918` stone, `#C5A880` bronze), serif headings, spacious whitespace, subtle transitions.
- **Equipment Catalog (`/shop`)**: Multi-facet filtering by boiler type (Dual, HX, Multi-Boiler), pump type (Rotary Vane vs Vibratory), usage domain (Home vs Commercial), and brand.
- **Product Detail (`/product/[slug]`)**: High-res editorial gallery, dynamic technical specification matrix, and **Sticky Purchase & Consultation Bar**.
- **Interactive Slide-over Cart**: Live subtotal calculations, free white-glove delivery threshold indicator, and **1-Click WhatsApp Cart Checkout**.
- **Side-by-Side Machine Comparison**: Real-time spec comparison matrix for up to 3 machines.
- **Atomic Checkout (`/checkout`)**: Direct order placement with inventory reservation & white-glove installation notes.

### 🛡️ Admin Operations (`apps/admin`)
- **Executive Metrics**: Live gross revenue, order volume, pending fulfillment, low-stock alerts, and WhatsApp lead conversion rates.
- **Product & Specs Manager**: Manage technical specs (boiler, pump, power, dimensions, water reservoir).
- **Inventory Ledger**: Real-time stock vs reserved stock with comprehensive movement audit trail (`PURCHASE`, `SALE`, `RESERVATION`, `ADJUSTMENT`).
- **Order Management**: Order lifecycle state machine (`PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `COMPLETED`).
- **WhatsApp Leads CRM**: Direct access to inquiries originating from product detail and cart checkout clicks.
- **Section-Based CMS**: Live editing of editorial hero headline, craft stories, and commercial solutions.

---

## 🛠️ Technology Stack

- **Storefront**: Next.js 14/15, React 18, Tailwind CSS, Lucide Icons, Zustand, Framer Motion.
- **Backend API**: NestJS, TypeScript, Prisma ORM, JWT, Passport, Class-Validator, Swagger OpenAPI.
- **Admin Portal**: Next.js 14/15, Tailwind CSS, TanStack Query, Lucide Icons.
- **Database**: PostgreSQL (Production) / SQLite (Rapid Local Testing), Redis caching.
- **Third-Party Integrations**: Meta WhatsApp Cloud API abstraction, Midtrans Snap / Xendit payment abstraction.

---

## 💻 Quick Start & Running Locally

### Prerequisites
- Node.js (LTS v18+)
- npm or pnpm
- (Optional) Docker for PostgreSQL & Redis

### 1. Installation
```bash
# Clone the repository
cd coffee-commerce

# Install all monorepo dependencies
npm install
```

### 2. Database Setup & Seed
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with 20+ realistic machines and editorial CMS
npm run db:seed
```

### 3. Run Applications Concurrently
```bash
# Starts API (:4000), Storefront (:3000), and Admin (:3001)
npm run dev
```

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3001](http://localhost:3001)
- **API Swagger Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **API Endpoint**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

---

## 🐳 Docker Deployment
```bash
docker compose up -d
```
