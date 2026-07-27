"use client";

import { useEffect } from "react";
import type { ProductId } from "@/config/products";
import { fbEventOnce, META_CATEGORIES, takeLeadContentName } from "@/lib/tracking/fpixel";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";

type LeadConversionTrackerProps = {
  /** Id du pôle (ex. "xr360") : suffixe les clés de dédup, ajoute le
      paramètre `product` aux events et choisit la catégorie Meta du pôle.
      Sans prop : clés et libellés historiques du funnel VR (un visiteur
      peut convertir sur deux funnels dans la même session, chaque pôle
      garde sa propre dédup). */
  product?: ProductId;
};

/**
 * Conversion poussée sur la page merci d'un pôle. La page est gated par le
 * cookie httpOnly de soumission, donc jamais de faux positif par accès
 * direct. Deux sorties, chacune dédupliquée par session (un reload ne
 * recompte pas) : `lead_submit` dans le dataLayer (GTM/GA4) et l'event
 * `Lead` du Meta Pixel. Le nom mémorisé au submit (secteur VR, type de
 * lieu 360…) enrichit le Lead Meta s'il est présent.
 */
export function LeadConversionTracker({ product }: LeadConversionTrackerProps) {
  useEffect(() => {
    const suffix = product === undefined ? "" : `_${product}`;
    pushDataLayerEventOnce(
      `lead_submit${suffix}`,
      "lead_submit",
      product === undefined ? {} : { product },
    );

    const contentName = takeLeadContentName();
    fbEventOnce(`lead${suffix}`, "Lead", {
      content_category: META_CATEGORIES[product ?? "vr"].lead,
      ...(contentName !== null && { content_name: contentName }),
    });
  }, [product]);

  return null;
}
