import type { ProductId } from "@/config/products";

/**
 * Contenu de l'accueil XR Technologie (socle « site », thème neutre).
 * RÈGLES : aucun texte en dur dans les sections ; copy neuro-marketing
 * (bénéfice avant caractéristique, projection du lecteur) ; jamais un
 * chiffre ou un engagement absent des sources (brochures docs/Utils,
 * catalogue VR docs/Offres).
 */

/** Hero : un verbe par pôle, chacun porté par sa couleur d'identité. */
export const homeHero = {
  kicker: "XR Technologie · Antananarivo",
  titleWords: [
    { word: "Vivez.", productId: "vr" },
    { word: "Montrez.", productId: "xr360" },
    { word: "Mesurez.", productId: "lidar" },
  ] satisfies readonly { word: string; productId: ProductId }[],
  subtitle:
    "Trois pôles XR au service de votre projet : des animations VR qui se déplacent jusqu'à vous, des visites virtuelles qui font découvrir vos lieux à distance et des relevés 3D qui transforment vos sites en données exploitables.",
  cta: "Découvrir nos pôles",
  /** id de la section pôles (scroll sans hash, comme le pôle VR). */
  ctaTargetId: "poles",
} as const;

export type PoleHighlight = {
  hook: string;
  body: string;
  points: readonly string[];
  cta: string | null;
};

/** Bandes de présentation des pôles. Fond : socle neutre ; le pôle ne
    porte que sa couleur d'identité (décision DA accueil, 27/07). */
export const poleShowcase: Record<ProductId, PoleHighlight> = {
  vr: {
    hook: "La VR qui se déplace jusqu'à vous",
    body: "Vous réservez, nous installons, vos invités vivent l'expérience. Casques Meta Quest 3, animateurs XR et univers adaptés à votre public, chez vous ou sur votre lieu.",
    points: [
      "Jusqu'à 10 casques Meta Quest 3 apportés sur place",
      "Animateurs XR qui encadrent chaque session",
      "8 offres sectorielles, packs à partir de 750 000 Ar",
    ],
    cta: "Découvrir XR VR",
  },
  xr360: {
    hook: "Votre lieu devient visitable à distance",
    body: "Vos futurs clients explorent votre établissement avant même de se déplacer : captation photo et vidéo 360, visite virtuelle interactive et diffusion sur tous les supports.",
    points: [
      "Captation photo & vidéo 360 professionnelle",
      "Visite virtuelle interactive, parcours fluide",
      "Diffusion web, mobile, tablette et casque VR",
    ],
    cta: "Découvrir XR 360",
  },
  lidar: {
    hook: "Votre site existe. Rendez-le exploitable.",
    body: "Un état des lieux ne devrait jamais rester une approximation : le relevé 3D transforme vos bâtiments en données fiables, prêtes pour vos architectes, bureaux d'études et équipes travaux.",
    points: [
      "Relevé 3D et nuage de points de l'existant",
      "Plans 2D, modèles 3D, scan-to-CAD et scan-to-BIM",
      "Interventions Madagascar, océan Indien et au-delà",
    ],
    cta: "Découvrir XR LiDAR",
  },
} as const;

export const polesSection = {
  id: "poles",
  kicker: "Trois pôles, trois codes visuels",
  title: "Une même exigence XR",
  upcomingLabel: "Bientôt en ligne",
} as const;

export const aboutSection = {
  kicker: "XR Technologie",
  title: "Trois métiers, une seule équipe",
  body: "Depuis Antananarivo, nous mettons l'immersion au travail avec du matériel professionnel et une méthode éprouvée. Vous n'avez rien à prévoir : chaque prestation est préparée, installée et accompagnée jusqu'au résultat.",
  items: [
    {
      title: "Basés à Antananarivo",
      body: "Interventions partout à Madagascar, et jusqu'à l'océan Indien pour le relevé 3D.",
    },
    {
      title: "Matériel professionnel",
      body: "Casques Meta Quest 3, captation 360 et scanner LiDAR, entretenus et prêts à l'emploi.",
    },
    {
      title: "Clé en main",
      body: "Préparation, installation, accompagnement : vous restez concentré sur votre projet.",
    },
  ],
} as const;

export const contactSection = {
  id: "contact",
  kicker: "Parlons de votre projet",
  title: "Une question ? Une idée à cadrer ?",
  body: "Écrivez-nous ou passez par WhatsApp : nous orientons votre demande vers le bon pôle et revenons vers vous rapidement.",
  emailLabel: "Nous écrire",
  whatsappLabel: "WhatsApp",
  whatsappMessage: "Bonjour XR Technologie ! J'ai une question sur vos prestations.",
  vrFormNote: "Un projet d'animation VR ? Le pôle XR VR a son formulaire de devis dédié.",
  vrFormCta: "Demander un devis VR",
} as const;

export const siteHeader = {
  navLabel: "Navigation du site",
  contactLabel: "Contact",
  upcomingBadge: "Bientôt",
} as const;

export const siteFooter = {
  baseline: "Expériences immersives, visites virtuelles et relevés 3D à Madagascar.",
  polesTitle: "Nos pôles",
  contactTitle: "Contact",
  privacyLabel: "Politique de confidentialité",
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;
