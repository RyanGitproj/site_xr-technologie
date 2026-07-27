import { z } from "zod";

/**
 * Attribution premier-touchpoint jointe aux leads de TOUS les pôles
 * (capturée par lib/tracking/attribution.ts au layout racine). Validée
 * CÔTÉ SERVEUR uniquement et jamais bloquante : invalide = ignorée.
 * Clés inconnues retirées par z.object (strip par défaut).
 */
const attributionValue = z.string().max(200).optional();

export const attributionSchema = z.object({
  utm_source: attributionValue,
  utm_medium: attributionValue,
  utm_campaign: attributionValue,
  utm_content: attributionValue,
  utm_term: attributionValue,
  gclid: attributionValue,
  fbclid: attributionValue,
  ad_id: attributionValue,
  ad_name: attributionValue,
  adset_id: attributionValue,
  adset_name: attributionValue,
  campaign_id: attributionValue,
  campaign_name: attributionValue,
  platform: attributionValue,
  referrer: z.string().max(500).optional(),
});

export type Attribution = z.infer<typeof attributionSchema>;
