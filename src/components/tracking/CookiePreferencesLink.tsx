"use client";

import { cookieConsent } from "@/config/consent";
import { resetConsentChoice } from "@/lib/tracking/consent";

/**
 * Rouvre le bandeau de consentement (modification ou retrait du choix cookies,
 * exigence CNIL). Utilisé au footer et sur /confidentialite. Le style vient de
 * l'appelant via className.
 */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={resetConsentChoice} className={className}>
      {cookieConsent.manageLabel}
    </button>
  );
}
