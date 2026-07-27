import { orNull, toAttributionColumns } from "@/lib/leads/attributionColumns";
import type { LeadRow } from "@/products/vr/lib/leadsDb";
import type { Attribution, Lead } from "@/products/vr/lib/lead";

/**
 * Mapping PUR formulaire + attribution → ligne funnel_xr_discovery_leads
 * (camelCase → snake_case, optionnels vides → null). Les colonnes
 * d'attribution et `is_organic` viennent du mapping partagé
 * lib/leads/attributionColumns.ts (commun à tous les pôles).
 */
export function toLeadRow(lead: Lead, attribution: Attribution | null): LeadRow {
  return {
    secteur: lead.secteur,
    pack: orNull(lead.pack),
    objectif_principal: lead.objectif,
    budget: lead.budget,
    periode: lead.periode,
    nom: lead.nom,
    telephone: lead.telephone,
    email: lead.email,
    participants: lead.participants === "" ? null : Number(lead.participants),
    entreprise: orNull(lead.entreprise),
    fonction: orNull(lead.fonction),
    ...toAttributionColumns(attribution),
  };
}
