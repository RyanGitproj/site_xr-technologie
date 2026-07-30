/**
 * Coordonnées et identité du site. Coordonnées réelles fournies par Ryan le
 * 30/07/2026 : seul point de vérité, aucun contact en dur dans une section.
 */
export const siteConfig = {
  /** Nom de l'entreprise et du site (graphie actée par Ryan le 27/07). */
  name: "XR Technologie",
  city: "Antananarivo",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xr-technologie.com",
  /** Numéro WhatsApp de réception des leads, format international sans « + ». */
  whatsappNumber: "261389230368",
  contactEmail: "contact@xr-technologie.com",
} as const;
