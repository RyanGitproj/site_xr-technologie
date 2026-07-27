import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AttributionColumns } from "@/lib/leads/attributionColumns";

/**
 * Ligne de `public.funnel_xr360_leads`, miroir de
 * supabase/migrations/20260727_xr360_leads.sql, hors colonnes gérées par la
 * base (id, created_at, lead_status). Optionnels absents = null.
 */
export type BriefRow = {
  type_lieu: string;
  objectif: string;
  supports: readonly string[];
  message: string | null;
  nom: string;
  telephone: string;
  email: string;
} & AttributionColumns;

/** Insert du brief. false = refus/erreur (loggé ici, jamais de throw vers l'UI). */
export async function insertBrief(supabase: SupabaseClient, row: BriefRow): Promise<boolean> {
  try {
    const { error } = await supabase.from("funnel_xr360_leads").insert(row);
    if (error !== null) {
      console.error("[brief-360] insert funnel_xr360_leads refusé :", error.message);
      return false;
    }
    return true;
  } catch (cause) {
    // Frontière externe (réseau) : l'échec remonte en résultat, pas en throw.
    console.error("[brief-360] insert funnel_xr360_leads injoignable :", cause);
    return false;
  }
}
