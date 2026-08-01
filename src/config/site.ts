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
  /** Même ligne en appel direct : E.164 pour les liens `tel:`, graphie affichée. */
  phone: {
    e164: "+261389230368",
    display: "+261 38 92 303 68",
  },
  contactEmail: "contact@xr-technologie.com",
  /** Identité légale (fiche CCIFM fournie par Ryan le 30/07/2026). Sert aux
      mentions légales et à la politique de confidentialité. */
  legal: {
    legalForm: "SARL au capital de 100 000 ariary",
    address: "LOT PR 109 Ter Ambodivoanjo, Antananarivo 101, Madagascar",
    nif: "5019666749",
    stat: "85497 11 2026 0 10557",
    rcs: "2026B00550",
  },
} as const;
