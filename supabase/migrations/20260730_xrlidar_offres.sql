-- Offres chiffrées LiDAR (brochures docs/Nouvelle_brochure, 30/07/2026) :
-- le brief porte désormais la famille d'offre (commerciale / technique), la
-- solution envisagée, le budget et la période. Colonnes nullables : la table
-- peut déjà contenir des briefs antérieurs à la refonte.
--
-- Valeurs : ids kebab-case de src/products/lidar/config/offers.ts et
-- lib/brief.ts (NE JAMAIS renommer après prod).

alter table public.funnel_xrlidar_leads
  add column famille text,
  add column offre text,
  add column budget text,
  add column periode text;
