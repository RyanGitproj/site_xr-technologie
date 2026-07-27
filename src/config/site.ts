/**
 * Coordonnées et identité du site. Les valeurs de contact sont des
 * PLACEHOLDERS tant que le client n'a pas fourni les vraies (voir TODO.md).
 */
export const siteConfig = {
  /** Nom de l'entreprise et du site (graphie actée par Ryan le 27/07). */
  name: "XR Technologie",
  city: "Antananarivo",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xr-technologie.com",
  /** Numéro WhatsApp de réception des leads, format international sans « + ». */
  whatsappNumber: "261340000000",
  contactEmail: "contact@xr-technologie.com",
} as const;
