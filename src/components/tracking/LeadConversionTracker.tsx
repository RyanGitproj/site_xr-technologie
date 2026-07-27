"use client";

import { useEffect } from "react";
import { fbEventOnce, META_CONTENT, takeLeadContentName } from "@/lib/tracking/fpixel";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";

/**
 * Conversion poussée sur /merci. La page est gated par le cookie httpOnly de
 * soumission, donc jamais de faux positif par accès direct. Deux sorties,
 * chacune dédupliquée par session (un reload de /merci ne recompte pas) :
 * `lead_submit` dans le dataLayer (GTM/GA4) et l'event `Lead` du Meta Pixel.
 * Le nom du secteur, mémorisé au submit, enrichit le Lead Meta s'il est présent.
 */
export function LeadConversionTracker() {
  useEffect(() => {
    pushDataLayerEventOnce("lead_submit", "lead_submit");

    const contentName = takeLeadContentName();
    fbEventOnce("lead", "Lead", {
      content_category: META_CONTENT.lead,
      ...(contentName !== null && { content_name: contentName }),
    });
  }, []);

  return null;
}
