import { orNull, toAttributionColumns } from "@/lib/leads/attributionColumns";
import type { BriefRow } from "@/products/lidar/lib/briefsDb";
import type { Attribution, Brief } from "@/products/lidar/lib/brief";

/**
 * Mapping PUR brief + attribution → ligne funnel_xrlidar_leads (camelCase →
 * snake_case, optionnels vides → null). Attribution et `is_organic` :
 * mapping partagé lib/leads/attributionColumns.ts.
 */
export function toBriefRow(brief: Brief, attribution: Attribution | null): BriefRow {
  return {
    type_site: brief.typeSite,
    localisation: brief.localisation,
    surface_estimee: orNull(brief.surface),
    objectif: brief.objectif,
    livrables: brief.livrables,
    logiciels: orNull(brief.logiciels),
    precisions: orNull(brief.precisions),
    nom: brief.nom,
    entreprise: orNull(brief.entreprise),
    telephone: brief.telephone,
    email: brief.email,
    ...toAttributionColumns(attribution),
  };
}
