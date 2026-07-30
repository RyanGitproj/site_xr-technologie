import type { PolicySection } from "./consent";
import { siteConfig } from "./site";

/**
 * Contenu de /mentions-legales. Identité : fiche CCIFM fournie par Ryan le
 * 30/07/2026 (via siteConfig.legal, seul point de vérité). Hébergeur : Render
 * (confirmé par Ryan le 30/07/2026).
 */
export const legalNotice = {
  title: "Mentions légales",
  updated: "Dernière mise à jour : 30 juillet 2026",
  intro:
    "Informations légales relatives à l'éditeur du site xr-technologie.com, à son hébergement et à l'utilisation de ses contenus.",
  sections: [
    {
      heading: "Éditeur du site",
      paragraphs: [
        `${siteConfig.name}, ${siteConfig.legal.legalForm}, immatriculée au registre du commerce et des sociétés d'Antananarivo sous le numéro ${siteConfig.legal.rcs}.`,
        `Siège social : ${siteConfig.legal.address}.`,
        `NIF : ${siteConfig.legal.nif} · STAT : ${siteConfig.legal.stat}.`,
        `Téléphone : ${siteConfig.legal.phoneDisplay} · E-mail : ${siteConfig.contactEmail}.`,
      ],
    },
    {
      heading: "Directeur de la publication",
      paragraphs: [`Le gérant de ${siteConfig.name}.`],
    },
    {
      heading: "Hébergement",
      paragraphs: [
        "Le site est hébergé par Render Services, Inc., 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis (render.com).",
      ],
    },
    {
      heading: "Propriété intellectuelle",
      paragraphs: [
        `L'ensemble des contenus du site (textes, visuels, vidéos, logos, éléments graphiques et code) est la propriété de ${siteConfig.name} ou fait l'objet d'une autorisation d'utilisation. Toute reproduction ou représentation, totale ou partielle, sans accord écrit préalable est interdite.`,
        "Les marques et logos de tiers cités, notamment Meta Quest, restent la propriété de leurs titulaires respectifs.",
      ],
    },
    {
      heading: "Responsabilité",
      paragraphs: [
        `${siteConfig.name} s'efforce de maintenir des informations exactes et à jour, sans garantir l'absence d'erreur ou d'omission. Les prix affichés sont indicatifs (« à partir de ») et ne constituent pas une offre contractuelle : seul un devis personnalisé engage ${siteConfig.name}.`,
      ],
    },
  ] satisfies readonly PolicySection[],
  /** Renvoi vers /confidentialite, rendu avec un lien (JSX côté page). */
  privacy: {
    heading: "Données personnelles et cookies",
    body: "La collecte des données personnelles sur ce site, l'usage des cookies et vos droits sont détaillés dans notre",
    linkLabel: "politique de confidentialité",
  },
} as const;
