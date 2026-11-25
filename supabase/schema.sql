-- =============================================================================
-- VINKA PLATFORM — SUPABASE POSTGRESQL SCHEMA
-- Execute this script in the Supabase SQL Editor to initialize all tables,
-- indexes, Row Level Security (RLS), and Storage buckets.
-- =============================================================================

create extension if not exists pgcrypto;

-- 1. USERS
create table if not exists public.users (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "email" text not null unique,
  "passwordHash" text not null,
  "role" text not null default 'client', -- client | provider | admin
  "phone" text,
  "city" text,
  "status" text not null default 'active', -- active | suspended
  "providerStatus" text, -- none | pending | approved | rejected
  "rejectionReason" text,
  "createdAt" timestamptz not null default now()
);

create index if not exists idx_users_role on public.users ("role");

-- 2. CATEGORIES
create table if not exists public.categories (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null unique,
  "kind" text not null, -- espacio | servicio
  "icon" text not null default 'sparkle',
  "tone" text not null default '#efe7de',
  "description" text not null default ''
);

-- 3. EVENT TYPES
create table if not exists public.event_types (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null unique
);

-- 4. LISTINGS
create table if not exists public.listings (
  "id" text primary key default gen_random_uuid()::text,
  "providerId" text not null,
  "providerName" text not null,
  "kind" text not null, -- espacio | servicio
  "title" text not null,
  "category" text not null,
  "location" text not null,
  "capacity" integer,
  "price" integer not null default 0,
  "priceUnit" text not null default 'por evento',
  "rating" double precision not null default 5.0,
  "reviews" integer not null default 0,
  "tag" text not null default 'Verificado',
  "description" text not null,
  "includedServices" jsonb not null default '[]'::jsonb,
  "rules" text not null default '',
  "schedule" text not null default '',
  "offersInvoicing" boolean not null default false,
  "image" text not null default '',
  "gallery" jsonb not null default '[]'::jsonb,
  "host" jsonb,
  "bookedDates" jsonb not null default '[]'::jsonb,
  "approvalStatus" text not null default 'pending', -- pending | approved | rejected
  "approvalRejectionReason" text,
  "active" boolean not null default false,
  "createdAt" timestamptz not null default now()
);

create index if not exists idx_listings_provider_id on public.listings ("providerId");
create index if not exists idx_listings_approval_active on public.listings ("approvalStatus", "active");

-- 5. EVENT QUOTES
create table if not exists public.event_quotes (
  "id" text primary key default gen_random_uuid()::text,
  "clientId" text not null,
  "clientName" text not null,
  "clientEmail" text not null,
  "occasion" text not null,
  "dateTime" text not null,
  "guests" integer not null default 80,
  "spaceId" text,
  "spaceTitle" text,
  "serviceIds" jsonb not null default '[]'::jsonb,
  "serviceTitles" jsonb not null default '[]'::jsonb,
  "bookingItems" jsonb not null default '[]'::jsonb,
  "totalAmount" integer not null default 0,
  "commissionAmount" integer not null default 0,
  "status" text not null default 'cotizado', -- cotizado | confirmado | completado | cancelado
  "notes" text not null default '',
  "invoiceRequested" boolean not null default false,
  "invoiceFolio" text,
  "createdAt" timestamptz not null default now()
);

create index if not exists idx_event_quotes_client_id on public.event_quotes ("clientId");
create index if not exists idx_event_quotes_status on public.event_quotes ("status");

-- 6. INVOICES
create table if not exists public.invoices (
  "id" text primary key default gen_random_uuid()::text,
  "folio" text not null unique,
  "eventId" text not null,
  "eventOccasion" text not null,
  "clientId" text not null,
  "clientName" text not null,
  "rfc" text not null,
  "razonSocial" text not null,
  "usoCfdi" text not null,
  "providerName" text not null,
  "subtotal" double precision not null,
  "iva" double precision not null,
  "total" double precision not null,
  "status" text not null default 'emitida', -- emitida | pendiente
  "issuedAt" timestamptz not null default now()
);

create index if not exists idx_invoices_client_id on public.invoices ("clientId");

-- 7. PROVIDER APPLICATIONS
create table if not exists public.provider_applications (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text not null unique,
  "email" text not null,
  "offeringType" text not null, -- espacio | servicio
  "subType" text not null,
  "specificDetails" text not null,
  "fullName" text not null,
  "address" text not null,
  "curp" text not null,
  "rfc" text not null,
  "socialOrWeb" text,
  "location" text not null,
  "businessName" text not null,
  "businessPermitDoc" text not null,
  "photos" jsonb not null default '[]'::jsonb,
  "categories" jsonb not null default '[]'::jsonb,
  "cost" integer not null default 0,
  "costUnit" text not null default 'por evento',
  "descriptionAndIncluded" text not null,
  "invoicingService" boolean not null default false,
  "rules" text not null,
  "signedContractFile" text not null,
  "scheduleAndAvailability" text not null,
  "capacity" integer,
  "status" text not null default 'pending', -- pending | approved | rejected
  "rejectionReason" text,
  "submittedAt" timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enabled on all tables in public schema to prevent unauthorized direct access.
-- Next.js server routes authenticate via SUPABASE_SERVICE_ROLE_KEY.
-- =============================================================================
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.event_types enable row level security;
alter table public.listings enable row level security;
alter table public.event_quotes enable row level security;
alter table public.invoices enable row level security;
alter table public.provider_applications enable row level security;

-- Public read-only policies for catalog tables when queried via anon key
drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can view event types" on public.event_types;
create policy "Public can view event types"
  on public.event_types for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can view approved active listings" on public.listings;
create policy "Public can view approved active listings"
  on public.listings for select
  to anon, authenticated
  using ("approvalStatus" = 'approved' and "active" = true);
