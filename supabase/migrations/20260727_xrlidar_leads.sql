-- Briefs du funnel XR LiDAR Opérationnel (relevé 3D, reality capture).
-- À exécuter dans le SQL editor Supabase (même projet que les autres funnels).
--
-- Sécurité : RLS activée SANS policy = deny-all pour anon/authenticated.
-- Seule la Server Action submitBrief écrit, via la clé secrète
-- (service_role) ; le navigateur ne parle jamais à Supabase.

create table public.funnel_xrlidar_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Brief mission (étapes 1-2 du formulaire) : ids kebab-case de
  -- src/products/lidar/lib/brief.ts (NE JAMAIS renommer après prod).
  type_site text not null,
  localisation text not null,
  surface_estimee text,
  objectif text not null,
  livrables text[] not null default '{}',
  logiciels text,
  precisions text,

  -- Contact (étape 3) : telephone au format E.164 (+261…).
  nom text not null,
  entreprise text,
  telephone text not null,
  email text not null,

  -- Suivi commercial (même convention que les autres funnels).
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

alter table public.funnel_xrlidar_leads enable row level security;

create index funnel_xrlidar_leads_created_at_idx
  on public.funnel_xrlidar_leads (created_at desc);

create index funnel_xrlidar_leads_email_idx
  on public.funnel_xrlidar_leads (email);
