import { toAttributionColumns } from "@/lib/leads/attributionColumns";
import type { BriefRow } from "@/products/xr360/lib/briefsDb";
import type { Attribution, Brief } from "@/products/xr360/lib/brief";

/**
 * Mapping PUR brief + attribution → ligne funnel_xr360_leads (camelCase →
 * snake_case, message vide → null). Attribution et `is_organic` : mapping
 * partagé lib/leads/attributionColumns.ts.
 */
export function toBriefRow(brief: Brief, attribution: Attribution | null): BriefRow {
  return {
    type_lieu: brief.typeLieu,
    objectif: brief.objectif,
    supports: brief.supports,
    message: brief.message === "" ? null : brief.message,
    nom: brief.nom,
    telephone: brief.telephone,
    email: brief.email,
    ...toAttributionColumns(attribution),
  };
}
