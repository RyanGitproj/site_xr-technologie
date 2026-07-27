import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AttributionColumns } from "@/lib/leads/attributionColumns";

/**
 * Ligne de `public.funnel_xr_discovery_leads`, miroir de
 * supabase/schema.sql, hors colonnes gérées par la base (id, created_at,
 * lead_status). Optionnels absents = null (jamais de chaîne vide en base).
 */
export type LeadRow = {
  secteur: string;
  pack: string | null;
  objectif_principal: string;
  budget: string;
  periode: string;
  nom: string;
  telephone: string;
  email: string;
  participants: number | null;
  entreprise: string | null;
  fonction: string | null;
} & AttributionColumns;

/** Insert du lead. false = refus/erreur (loggé ici, jamais de throw vers l'UI). */
export async function insertLead(supabase: SupabaseClient, row: LeadRow): Promise<boolean> {
  try {
    const { error } = await supabase.from("funnel_xr_discovery_leads").insert(row);
    if (error !== null) {
      console.error("[lead] insert funnel_xr_discovery_leads refusé :", error.message);
      return false;
    }
    return true;
  } catch (cause) {
    // Frontière externe (réseau) : l'échec remonte en résultat, pas en throw.
    console.error("[lead] insert funnel_xr_discovery_leads injoignable :", cause);
    return false;
  }
}
