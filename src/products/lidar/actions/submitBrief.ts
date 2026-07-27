"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { attributionSchema, briefSchema } from "@/products/lidar/lib/brief";
import { insertBrief } from "@/products/lidar/lib/briefsDb";
import { toBriefRow } from "@/products/lidar/lib/toBriefRow";

export type SubmitBriefResult = { ok: false; error: string };

/**
 * Réception du brief LiDAR. Validation serveur avec LE MÊME schéma Zod que
 * le client, persistance Supabase (funnel_xrlidar_leads, service_role),
 * cookie httpOnly 30 min pour /lidar/merci, puis redirection. L'attribution
 * invalide est ignorée (jamais bloquante) ; sans configuration Supabase le
 * brief est loggé (mode maquette) ; un insert REFUSÉ remonte au visiteur,
 * pour ne jamais perdre un lead en silence.
 */
export async function submitBrief(
  input: unknown,
  attributionInput: unknown,
): Promise<SubmitBriefResult | undefined> {
  const parsed = briefSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Certaines réponses sont invalides. Vérifiez le formulaire." };
  }

  const attribution = attributionSchema.safeParse(attributionInput);
  const row = toBriefRow(parsed.data, attribution.success ? attribution.data : null);

  const supabase = getSupabaseServerClient();
  if (supabase === null) {
    // Maquette : persistance non configurée (voir TODO.md), on logge le brief.
    console.info("[brief-lidar] Supabase non configuré, brief reçu :", row);
  } else {
    const inserted = await insertBrief(supabase, row);
    if (!inserted) {
      return {
        ok: false,
        error: "Impossible d'enregistrer votre demande. Réessayez dans un instant.",
      };
    }
  }

  const cookieStore = await cookies();
  cookieStore.set("xrlidar_brief", "1", {
    httpOnly: true,
    maxAge: 60 * 30,
    sameSite: "lax",
    path: "/",
  });
  redirect("/lidar/merci");
}
