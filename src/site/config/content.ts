import {
  Globe,
  GraduationCap,
  HardHat,
  MapPin,
  ScanLine,
  ShieldCheck,
  Store,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ProductId } from "@/config/products";
import type { ImageSlot } from "@/lib/images";

/**
 * Contenu de l'accueil XR Technologie (socle « site », thème neutre).
 * RÈGLES : aucun texte en dur dans les sections ; copy neuro-marketing
 * (bénéfice avant caractéristique, projection du lecteur) ; jamais un
 * chiffre ou un engagement absent des sources (brochures docs/Utils,
 * catalogue VR docs/Offres).
 */

export type HeroTitleSegment = {
  text: string;
  /** Mot-clé porté par l'accent d'un pôle (vente → 360, formation → VR,
      décision → LiDAR) ; absent = encre neutre. */
  productId?: ProductId;
};

export type HeroCard = {
  label: string;
  productId: ProductId;
  image: ImageSlot | null;
};

/** Hero : la promesse du PDF boss (p1) en titre, les trois résultats
    portés chacun par la couleur d'un pôle (charte, pas le bleu du PDF). */
export const homeHero = {
  kicker: "XR Technologie · Antananarivo",
  titleSegments: [
    { text: "Transformez vos lieux en outils de " },
    { text: "vente", productId: "xr360" },
    { text: ", de " },
    { text: "formation", productId: "vr" },
    { text: " et de " },
    { text: "décision", productId: "lidar" },
    { text: "." },
  ] satisfies readonly HeroTitleSegment[],
  cta: "Choisir mon objectif",
  /** id de la section objectifs (scroll sans hash, comme le pôle VR). */
  ctaTargetId: "objectifs",
  /** Nom du rail des portes pour les lecteurs d'écran. */
  cardsLabel: "Nos trois portes d'entrée",
  /** Les 3 portes d'entrée (réf. p1 du PDF) : cartes photo qui chevauchent
      le bas du hero, chacune route vers son pôle (faire vivre → 360,
      former et convaincre → VR, numériser et suivre → LiDAR). */
  cards: [
    {
      label: "Faire vivre un lieu",
      productId: "xr360",
      image: {
        src: "/images/funnel-v2/xr360-pano-restaurant.webp",
        alt: "",
        width: 1920,
        height: 960,
      },
    },
    {
      label: "Former et convaincre",
      productId: "vr",
      /** Lot K Codex : visuel dédié (fin du doublon avec la carte objectif
          « former vos équipes »). */
      image: {
        src: "/images/funnel-v2/home-porte-former-convaincre.webp",
        alt: "",
        width: 1600,
        height: 1067,
      },
    },
    {
      label: "Numériser et suivre",
      productId: "lidar",
      image: {
        src: "/images/funnel-v2/lidar-chantier-scanner.webp",
        alt: "",
        width: 1600,
        height: 1000,
      },
    },
  ] as readonly HeroCard[],
  /** Fond du hero (lot C) : équipe + matériel au-dessus de Tana, sujet à
      droite. Chargé en priority : re-mesurer le LCP 3G à chaque
      changement de visuel. */
  image: {
    src: "/images/funnel-v2/home-hero-equipe.webp",
    alt: "L'équipe XR Technologie autour de ses casques VR, caméra 360, drone et scanner, au-dessus d'Antananarivo au crépuscule",
    width: 1920,
    height: 1200,
  } as ImageSlot | null,
  /** Variante portrait (art direction < 768 px) : équipe centrée, cadrage
      vertical pensé pour mobile. */
  imageMobile: {
    src: "/images/funnel-v2/home-hero-equipe-mobile.webp",
    alt: "",
    width: 1080,
    height: 1350,
  } as ImageSlot | null,
} as const;

export type Objective = {
  icon: LucideIcon;
  productId: ProductId;
  title: string;
  note: string;
  /** Fond photo (lot A du brief Codex) ; null = carte sobre sans visuel. */
  image: ImageSlot | null;
};

/** Orientation par objectif (Funnel V2, réf. PDF boss p2) : le lecteur
    choisit le résultat qu'il veut obtenir, chaque carte l'emmène au pôle
    qui le produit. Le fond vient des brochures, jamais de promesse neuve. */
export const objectivesSection = {
  id: "objectifs",
  kicker: "Par où commencer ?",
  title: "Que voulez-vous obtenir ?",
  subtitle:
    "Six objectifs concrets, trois pôles pour les atteindre : choisissez le vôtre, nous nous occupons du chemin.",
  items: [
    {
      icon: Store,
      productId: "vr",
      title: "Attirer et vendre",
      note: "Une animation VR qui crée l'événement là où sont vos clients.",
      image: {
        src: "/images/funnel-v2/home-objectif-attirer-vendre.webp",
        alt: "Vitrine de boutique premium éclairée de nuit",
        width: 1200,
        height: 800,
      },
    },
    {
      icon: Globe,
      productId: "xr360",
      title: "Faire visiter à distance",
      note: "La première visite a lieu avant même le déplacement.",
      image: {
        src: "/images/funnel-v2/home-objectif-visite-distance.webp",
        alt: "Villa moderne éclairée au crépuscule",
        width: 1200,
        height: 800,
      },
    },
    {
      icon: Video,
      productId: "xr360",
      title: "Créer un contenu immersif",
      note: "Captation 360 diffusée sur tous vos supports.",
      image: {
        src: "/images/funnel-v2/home-objectif-contenu-immersif.webp",
        alt: "Personne devant un grand écran immersif lumineux",
        width: 1200,
        height: 800,
      },
    },
    {
      icon: GraduationCap,
      productId: "vr",
      title: "Former vos équipes",
      note: "Des sessions VR encadrées, directement sur votre site.",
      image: {
        src: "/images/funnel-v2/home-objectif-former-equipes.webp",
        alt: "Équipe en salle de formation face à un écran",
        width: 1200,
        height: 800,
      },
    },
    {
      icon: ScanLine,
      productId: "lidar",
      title: "Documenter l'existant",
      note: "Vos bâtiments transformés en données exploitables.",
      image: {
        src: "/images/funnel-v2/home-objectif-documenter-existant.webp",
        alt: "Plateau à rénover avec trépied de scan en silhouette",
        width: 1200,
        height: 800,
      },
    },
    {
      icon: HardHat,
      productId: "lidar",
      title: "Suivre un site ou un chantier",
      note: "Une trace numérique fiable de chaque étape.",
      image: {
        src: "/images/funnel-v2/home-objectif-suivre-chantier.webp",
        alt: "Chantier avec grue au crépuscule",
        width: 1200,
        height: 800,
      },
    },
  ] satisfies readonly Objective[],
  hesitation: "Vous hésitez entre plusieurs objectifs ?",
  hesitationCta: "Décrire mon besoin",
  /** Scroll sans hash vers le contact (même pattern que le CTA du hero). */
  hesitationTargetId: "contact",
} as const;

export type Sector = {
  /** Pôle qui donne sa couleur à la carte (liseré, cadre). */
  accent: ProductId;
  label: string;
  /** Pôles pertinents pour le secteur, affichés en chips-liens. */
  poles: readonly ProductId[];
  /** Visuel du secteur (lot B du brief docs/images-funnel-v2-brief.md) ;
      null = placeholder dégradé en attendant la livraison. */
  image: ImageSlot | null;
};

/** Secteurs à forte valeur (Funnel V2, réf. PDF boss p3) : le lecteur se
    reconnaît, les chips l'emmènent vers les pôles pertinents. Mapping
    fondé sur les brochures (360 : hôtels, immobilier, patrimoine ; LiDAR :
    BTP, industrie, logistique ; VR : campus, écoles, tourisme). */
export const sectorsSection = {
  id: "secteurs",
  kicker: "Vous reconnaissez-vous ?",
  title: "Les secteurs où l'immersion crée le plus de valeur",
  items: [
    {
      accent: "xr360",
      label: "Hôtels, resorts et tourisme",
      poles: ["xr360", "vr"],
      image: {
        src: "/images/funnel-v2/home-secteur-hotels-tourisme.webp",
        alt: "Piscine de resort au crépuscule sous les palmiers",
        width: 1200,
        height: 800,
      },
    },
    {
      accent: "xr360",
      label: "Promoteurs et immobilier premium",
      poles: ["xr360", "lidar"],
      image: {
        src: "/images/funnel-v2/home-secteur-immobilier.webp",
        alt: "Immeuble résidentiel premium aux balcons éclairés, de nuit",
        width: 1200,
        height: 800,
      },
    },
    {
      accent: "lidar",
      label: "Architecture, BTP et bureaux d'études",
      poles: ["lidar"],
      image: {
        src: "/images/funnel-v2/home-secteur-architecture-btp.webp",
        alt: "Bureau d'études de nuit, écran filaire 3D et casque de chantier",
        width: 1200,
        height: 800,
      },
    },
    {
      accent: "lidar",
      label: "Industrie, énergie et sites techniques",
      poles: ["lidar"],
      image: {
        src: "/images/funnel-v2/home-secteur-industrie.webp",
        alt: "Technicien de dos dans un site industriel de nuit",
        width: 1200,
        height: 800,
      },
    },
    {
      accent: "lidar",
      label: "Ports, aéroports et logistique",
      poles: ["lidar"],
      image: {
        src: "/images/funnel-v2/home-secteur-logistique.webp",
        alt: "Terminal à conteneurs de nuit, portiques éclairés",
        width: 1200,
        height: 800,
      },
    },
    {
      accent: "vr",
      label: "Patrimoine, institutions et grands campus",
      poles: ["vr", "xr360"],
      image: {
        src: "/images/funnel-v2/home-secteur-patrimoine.webp",
        alt: "Façade historique en pierre et allée arborée à l'heure bleue",
        width: 1200,
        height: 800,
      },
    },
  ] as readonly Sector[],
  /** Libellés courts des chips-liens vers les pôles. */
  poleChipLabels: {
    vr: "XR VR",
    xr360: "XR 360",
    lidar: "XR LiDAR",
  } satisfies Record<ProductId, string>,
  diagnosticNote:
    "Chaque mission commence par un diagnostic : vos objectifs d'abord, la technique ensuite.",
} as const;

export type PoleHighlight = {
  hook: string;
  body: string;
  cta: string | null;
  /** Packshot Codex (lot H) : repli 2D de l'objet 3D de la bande. null =
      halo CSS en attendant la livraison ; le brancher suffit, zéro code. */
  packshot: ImageSlot | null;
};

/** Bandes de présentation des pôles. Fond : socle neutre ; le pôle ne
    porte que sa couleur d'identité (décision DA accueil, 27/07) et montre
    son VRAI objet en 3D. Les listes de points ont disparu (elles
    redisaient les pages pôles) : hook + une phrase de projection + CTA. */
export const poleShowcase: Record<ProductId, PoleHighlight> = {
  vr: {
    hook: "La VR qui se déplace jusqu'à vous",
    body: "Vous réservez, nous installons, vos invités vivent l'expérience. Casques Meta Quest 3, animateurs XR et univers adaptés à votre public, chez vous ou sur votre lieu.",
    cta: "Découvrir XR VR",
    packshot: {
      src: "/images/funnel-v2/home-produit-casque-vr.webp",
      alt: "Casque de réalité virtuelle blanc",
      width: 1200,
      height: 1200,
    },
  },
  xr360: {
    hook: "Votre lieu devient visitable à distance",
    body: "Vos futurs clients explorent votre établissement avant même de se déplacer : captation photo et vidéo 360, visite virtuelle interactive et diffusion sur tous les supports.",
    cta: "Découvrir XR 360",
    packshot: {
      src: "/images/funnel-v2/home-produit-camera-360.webp",
      alt: "Caméra 360 sur perche",
      width: 1200,
      height: 1200,
    },
  },
  lidar: {
    hook: "Décidez sur des données, pas sur des estimations",
    body: "Le relevé 3D transforme vos bâtiments en données fiables, prêtes pour vos architectes, bureaux d'études et équipes travaux.",
    cta: "Découvrir XR LiDAR",
    packshot: {
      src: "/images/funnel-v2/home-produit-scanner-lidar.webp",
      alt: "Scanner 3D sur trépied",
      width: 1200,
      height: 1200,
    },
  },
} as const;

export const polesSection = {
  id: "poles",
  kicker: "Trois façons de mettre l'immersion au travail",
  title: "Une même exigence XR",
  upcomingLabel: "Bientôt en ligne",
} as const;

/** Bande réassurance (remplace l'ancienne section « à propos », qui
    concaténait les bandes pôles) : 4 preuves en labels courts, respiration
    sans titre façon /vr. */
export const homeReassurance = {
  ariaLabel: "XR Technologie en bref",
  items: [
    { icon: MapPin, label: "Basés à Antananarivo" },
    { icon: Globe, label: "Madagascar et océan Indien" },
    { icon: Wrench, label: "Matériel professionnel" },
    { icon: ShieldCheck, label: "Prestations clé en main" },
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
} as const;

export const siteHeader = {
  navLabel: "Navigation du site",
  contactLabel: "Contact",
  upcomingBadge: "Bientôt",
} as const;

/** Lockup officiel XR Technologie (docs/logo, détouré en alpha) : navbar et
    footer du socle site. */
export const siteLogo: ImageSlot = {
  src: "/images/logo-xr-technologie.webp",
  alt: "XR Technologie, Antananarivo",
  width: 800,
  height: 194,
};

export const siteFooter = {
  baseline: "Expériences immersives, visites virtuelles et relevés 3D à Madagascar.",
  polesTitle: "Nos pôles",
  contactTitle: "Contact",
  privacyLabel: "Politique de confidentialité",
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;
