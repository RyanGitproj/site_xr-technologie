"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { attributionSchema, briefSchema } from "@/products/xr360/lib/brief";
import { insertBrief } from "@/products/xr360/lib/briefsDb";
import { toBriefRow } from "@/products/xr360/lib/toBriefRow";

export type SubmitBriefResult = { ok: false; error: string };

/**
 * Réception du brief 360. Validation serveur avec LE MÊME schéma Zod que le
 * client, persistance Supabase (funnel_xr360_leads, service_role), cookie
 * httpOnly 30 min pour /360/merci, puis redirection. L'attribution invalide
 * est ignorée (jamais bloquante) ; sans configuration Supabase le brief est
 * loggé (mode maquette) ; un insert REFUSÉ remonte au visiteur, pour ne
 * jamais perdre un lead en silence.
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
    console.info("[brief-360] Supabase non configuré, brief reçu :", row);
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
  cookieStore.set("xr360_brief", "1", {
    httpOnly: true,
    maxAge: 60 * 30,
    sameSite: "lax",
    path: "/",
  });
  redirect("/360/merci");
}
