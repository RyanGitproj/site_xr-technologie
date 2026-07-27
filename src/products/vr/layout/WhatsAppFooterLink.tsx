"use client";

import type { ReactNode } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * Lien WhatsApp du footer, tracé : pousse `whatsapp_click` dans le dataLayer
 * (consommable par GTM/GA4). Inoffensif sans GTM chargé (aucun cookie).
 */
export function WhatsAppFooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => pushDataLayerEvent("whatsapp_click")}
    >
      {children}
    </a>
  );
}
