-- Offres chiffrées XR 360 (brochure docs/Nouvelle_brochure, 30/07/2026) :
-- le brief porte désormais l'offre envisagée (essentiel / visite-pro /
-- immersion-premium), le budget et la période. Colonnes nullables : la table
-- peut déjà contenir des briefs antérieurs à la refonte. `type_lieu` existe
-- déjà et sert d'axe aux tuiles de la section Offres.
--
-- Valeurs : ids kebab-case de src/products/xr360/config/offers.ts et
-- lib/brief.ts (NE JAMAIS renommer après prod).

alter table public.funnel_xr360_leads
  add column offre text,
  add column budget text,
  add column periode text;
