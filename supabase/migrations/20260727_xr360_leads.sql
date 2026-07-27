-- Briefs du funnel XR 360 (visite virtuelle & valorisation immersive).
-- À exécuter dans le SQL editor Supabase (même projet que les autres funnels).
--
-- Sécurité : RLS activée SANS policy = deny-all pour anon/authenticated.
-- Seule la Server Action submitBrief écrit, via la clé secrète
-- (service_role) ; le navigateur ne parle jamais à Supabase.

create table public.funnel_xr360_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Brief (étapes 1-2 du formulaire) : ids kebab-case de
  -- src/products/xr360/lib/brief.ts (NE JAMAIS renommer après prod).
  type_lieu text not null,
  objectif text not null,
  supports text[] not null default '{}',
  message text,

  -- Contact (étape 3) : telephone au format E.164 (+261…).
  nom text not null,
  telephone text not null,
  email text not null,

  -- Suivi commercial (même convention que funnel_xr_discovery_leads).
  lead_status text not null default 'New',

  -- Attribution premier-touchpoint (query string des campagnes + referrer).
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  gclid text,
  fbclid text,
  ad_id text,
  ad_name text,
  adset_id text,
  adset_name text,
  campaign_id text,
  campaign_name text,
  platform text,
  is_organic boolean not null default false
);

alter table public.funnel_xr360_leads enable row level security;

create index funnel_xr360_leads_created_at_idx
  on public.funnel_xr360_leads (created_at desc);

create index funnel_xr360_leads_email_idx
  on public.funnel_xr360_leads (email);
