"use client";

import type { ReactNode } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * Lien d'appel direct tracé : pousse `phone_click` dans le dataLayer
 * (consommable par GTM/GA4). Inoffensif sans GTM chargé (aucun cookie).
 */
export function PhoneLink({
  e164,
  className,
  children,
}: {
  /** Numéro au format E.164 (ex. « +261389230368 ») pour le lien `tel:`. */
  e164: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`tel:${e164}`}
      className={className}
      onClick={() => pushDataLayerEvent("phone_click")}
    >
      {children}
    </a>
  );
}
