import type { Attribution } from "@/lib/validations/attribution";

/** Optionnel vide → null : jamais de chaîne vide en base. */
export const orNull = (value: string | undefined): string | null =>
  value === undefined || value === "" ? null : value;

/** Colonnes d'attribution communes aux tables de leads de tous les pôles. */
export type AttributionColumns = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  gclid: string | null;
  fbclid: string | null;
  ad_id: string | null;
  ad_name: string | null;
  adset_id: string | null;
  adset_name: string | null;
  campaign_id: string | null;
  campaign_name: string | null;
  platform: string | null;
  is_organic: boolean;
};

/**
 * Mapping PUR attribution premier-touchpoint → colonnes de table.
 * `is_organic` = aucun marqueur payant (utm_source, click-ids, ad_id).
 */
export function toAttributionColumns(attribution: Attribution | null): AttributionColumns {
  const attr = attribution ?? {};
  const utmSource = orNull(attr.utm_source);
  const gclid = orNull(attr.gclid);
  const fbclid = orNull(attr.fbclid);
  const adId = orNull(attr.ad_id);

  return {
    utm_source: utmSource,
    utm_medium: orNull(attr.utm_medium),
    utm_campaign: orNull(attr.utm_campaign),
    utm_content: orNull(attr.utm_content),
    utm_term: orNull(attr.utm_term),
    referrer: orNull(attr.referrer),
    gclid,
    fbclid,
    ad_id: adId,
    ad_name: orNull(attr.ad_name),
    adset_id: orNull(attr.adset_id),
    adset_name: orNull(attr.adset_name),
    campaign_id: orNull(attr.campaign_id),
    campaign_name: orNull(attr.campaign_name),
    platform: orNull(attr.platform),
    is_organic: utmSource === null && gclid === null && fbclid === null && adId === null,
  };
}
