/**
 * Textes site-wide du consentement cookies (CNIL) et de la politique de
 * confidentialité (/confidentialite). Communs à tous les pôles : le bandeau
 * et la politique couvrent le site entier, pas un funnel en particulier.
 */

/** Bandeau de consentement cookies (CNIL). Texte orienté finalité : mesure
    d'audience + personnalisation publicitaire, sans masquer l'objet réel. */
export const cookieConsent = {
  ariaLabel: "Consentement aux cookies",
  text: "Nous utilisons des cookies pour mesurer l'audience du site et personnaliser nos campagnes publicitaires. Vous restez libre d'accepter ou de refuser, et de changer d'avis quand vous voulez.",
  policyLabel: "Politique de confidentialité",
  accept: "Accepter",
  refuse: "Refuser",
  manageLabel: "Gérer mes cookies",
} as const;

import { siteConfig } from "./site";

export type PolicySection = {
  heading: string;
  paragraphs: readonly string[];
};

/** Contenu de /confidentialite. Reflète ce que le code fait réellement :
    formulaire de devis persisté (Supabase), attribution UTM, cookies GA4/GTM
    (mesure) et Meta Pixel (publicité) déposés seulement après consentement. */
export const privacyPolicy = {
  title: "Politique de confidentialité",
  updated: "Dernière mise à jour : 30 juillet 2026",
  intro:
    "Cette page explique quelles données personnelles nous collectons sur le site XR VR Discovery, pourquoi, et comment vous gardez la main sur vos choix, notamment en matière de cookies.",
  sections: [
    {
      heading: "Responsable du traitement",
      paragraphs: [
        `Le responsable du traitement est ${siteConfig.name}, ${siteConfig.legal.legalForm}, dont le siège est situé ${siteConfig.legal.address} (NIF ${siteConfig.legal.nif}, RCS ${siteConfig.legal.rcs}).`,
        `Vous pouvez la joindre par e-mail à ${siteConfig.contactEmail} ou par téléphone au ${siteConfig.legal.phoneDisplay}.`,
      ],
    },
    {
      heading: "Données du formulaire de devis",
      paragraphs: [
        "Lorsque vous demandez un devis, nous collectons les informations que vous renseignez : secteur et pack choisis, description de votre projet, nombre de participants, ainsi que vos coordonnées (nom, adresse e-mail et numéro de téléphone).",
        "Ces données servent uniquement à traiter votre demande et à vous recontacter. La base légale est l'exécution de mesures précontractuelles prises à votre demande.",
      ],
    },
    {
      heading: "Données de navigation et cookies",
      paragraphs: [
        "Avec votre consentement, nous déposons des cookies de mesure d'audience (Google Analytics, via Google Tag Manager) et de personnalisation publicitaire (Meta Pixel). Ils nous aident à comprendre l'usage du site et à mesurer l'efficacité de nos campagnes.",
        "Aucun de ces cookies n'est déposé tant que vous n'avez pas cliqué sur « Accepter ». Si vous refusez, seul le strict nécessaire au fonctionnement du site reste actif. La base légale de ces traitements est votre consentement.",
      ],
    },
    {
      heading: "Origine de votre visite",
      paragraphs: [
        "Pour savoir par quel canal vous êtes arrivé (par exemple un lien publicitaire), nous conservons le temps de votre visite les paramètres de provenance de l'adresse (UTM et identifiants de campagne). Ils sont joints à votre demande si vous soumettez le formulaire.",
      ],
    },
    {
      heading: "Destinataires",
      paragraphs: [
        "Vos données sont accessibles à l'équipe de XR Technologie chargée du suivi commercial. Elles sont hébergées chez notre prestataire technique (Supabase). Les données de mesure et de publicité sont traitées, selon votre consentement, par Google et Meta.",
      ],
    },
    {
      heading: "Durées de conservation",
      paragraphs: [
        "Les données liées à votre demande de devis (coordonnées, projet, attribution) sont conservées 3 ans à compter de notre dernier échange, puis supprimées. Les cookies de mesure et de publicité ont une durée de vie limitée, propre à chaque outil, et votre consentement vous est redemandé périodiquement.",
      ],
    },
    {
      heading: "Vos droits",
      paragraphs: [
        "Conformément à la loi malgache n° 2014-038 sur la protection des données à caractère personnel et, si vous résidez dans l'Union européenne, au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition sur vos données. Vous pouvez également retirer votre consentement aux cookies à tout moment.",
      ],
    },
  ] satisfies readonly PolicySection[],
  manage: {
    heading: "Gérer mes cookies",
    body: "Vous pouvez revenir sur votre choix quand vous le souhaitez : le bouton ci-dessous rouvre le bandeau de consentement.",
  },
  contact: {
    heading: "Nous contacter",
    body: "Pour exercer vos droits ou poser une question sur cette politique, écrivez-nous à",
  },
  /** Attribution CC-BY obligatoire (modèle 3D de la scène de plongée VR). */
  credits: {
    heading: "Crédits",
    body: "Modèle 3D « Oculus Quest 3 » par AVILOV (Sketchfab), utilisé sur la page XR VR, sous licence",
    licenseLabel: "CC-BY 4.0",
    licenseHref: "https://creativecommons.org/licenses/by/4.0/",
  },
} as const;
