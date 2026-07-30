import {
  Box,
  Building2,
  Camera,
  ClipboardCheck,
  Clock,
  Crosshair,
  Factory,
  FileText,
  Landmark,
  LineChart,
  ListChecks,
  MessagesSquare,
  Plane,
  ScanLine,
  Send,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ImageSlot } from "@/lib/images";

/**
 * Contenu du funnel XR LiDAR Opérationnel (relevé 3D, reality capture).
 * SOURCE DE VÉRITÉ : la brochure officielle
 * `docs/Utils/XR LiDAR Opérationnel.pdf` (fond fidèle, copy réécrit
 * neuro-marketing SAUF le bloc « limites et précisions » et la mention
 * essentielle, repris tels quels : engagement légal). Aucun prix : le
 * parcours est un brief mission (« Présenter mon site », CTA charte).
 */

/* Navigation interne par scrollTo (aucune ancre d'URL) : id = id de section. */
export const navLidar = [
  { label: "Usages", id: "applications" },
  { label: "Acquisition", id: "acquisition" },
  { label: "Jumeau numérique", id: "pipeline" },
  { label: "Livrables", id: "livrables" },
  { label: "Offres", id: "offres" },
  { label: "Mission", id: "mission" },
] as const;

export const heroLidar = {
  kicker: "XR LiDAR Opérationnel · Relevé 3D · Reality capture",
  titleLead: "Le terrain ne devrait pas",
  titleAccent: "rester une approximation.",
  baseline: "Mesurer. Documenter. Exploiter.",
  cta: "Présenter mon site",
  ctaTargetId: "brief",
  /** Fond du hero (lot F) : scanner au faisceau vert dans un plateau en
      travaux. Priority : re-mesurer le LCP à chaque changement de visuel. */
  image: {
    src: "/images/funnel-v2/lidar-chantier-scanner.webp",
    alt: "Scanner 3D sur trépied balayant un plateau en travaux d'un faisceau vert",
    width: 1600,
    height: 1000,
  } as ImageSlot | null,
  chips: [
    { icon: ScanLine, label: "Relevé 3D" },
    { icon: Box, label: "Nuage de points" },
    { icon: FileText, label: "Scan-to-CAD / BIM" },
    { icon: Camera, label: "Documentation de l'existant" },
  ],
} as const;

export type IconItem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/** Bande réassurance (respiration façon /vr) : FUSION TRIPLE des anciennes
    listes benefits + « ce que la captation améliore » + « pourquoi XR
    LiDAR » (elles se redisaient quasi mot pour mot). Les 5 labels sont les
    titres du « pourquoi » de la brochure. */
export const benefitsLidar = {
  id: "benefices",
  ariaLabel: "Pourquoi XR LiDAR",
  items: [
    { icon: Crosshair, label: "Précision et fiabilité" },
    { icon: Clock, label: "Gain de temps" },
    { icon: Users, label: "Référence commune" },
    { icon: FileText, label: "Trace et historique" },
    { icon: LineChart, label: "Meilleure anticipation" },
  ],
} as const;

export const audienceLidar = {
  title: "À qui s'adresse cette offre ?",
  items: [
    "Architectes",
    "Bureaux d'études",
    "Entreprises du BTP",
    "Promoteurs immobiliers",
    "Maîtres d'œuvre",
    "Gestionnaires de patrimoine",
    "Industriels",
    "Exploitants de bâtiments",
    "Propriétaires de sites complexes",
  ],
} as const;

/** Trois modes d'acquisition (Funnel V2, réf. PDF boss p14). Matériel
    affiché sur arbitrage du 28/07 (source boss) ; la mention drone
    « selon mission et autorisations » est reprise FIDÈLEMENT. */
export const acquisitionLidar = {
  id: "acquisition",
  kicker: "Trois modes d'acquisition",
  title: "Au sol, à la main ou depuis le ciel",
  subtitle: "Le mode de captation se choisit selon le site, ses accès et l'objectif.",
  modes: [
    {
      icon: ScanLine,
      title: "Acquisition terrestre",
      hardware: "Matterport Pro3",
      note: null,
      body: "Le scanner sur trépied pour les intérieurs et les volumes complexes : la référence de la mission.",
      /** Lot I Codex : cartes photo, texte sur zone sombre. */
      image: {
        src: "/images/funnel-v2/lidar-acquisition-terrestre.webp",
        alt: "Scanner 3D sur trépied dans un plateau brut, ligne laser verte",
        width: 1600,
        height: 1067,
      } as ImageSlot | null,
    },
    {
      icon: Smartphone,
      title: "Capture mobile",
      hardware: "iPhone 15 Pro LiDAR",
      note: null,
      body: "La captation légère des zones difficiles d'accès ou des besoins rapides, en complément du scanner.",
      image: {
        src: "/images/funnel-v2/lidar-acquisition-mobile.webp",
        alt: "Smartphone en cours de scan dans un couloir technique",
        width: 1600,
        height: 1067,
      } as ImageSlot | null,
    },
    {
      icon: Plane,
      title: "Acquisition aérienne",
      hardware: "Drone LiDAR",
      note: "Selon mission et autorisations",
      body: "Toitures, façades et emprises extérieures, quand le projet le justifie et que le cadre le permet.",
      image: {
        src: "/images/funnel-v2/lidar-acquisition-aerienne.webp",
        alt: "Drone de cartographie balayant une toiture au crépuscule",
        width: 1600,
        height: 1067,
      } as ImageSlot | null,
    },
  ] satisfies readonly {
    icon: LucideIcon;
    title: string;
    hardware: string;
    note: string | null;
    body: string;
    image: ImageSlot | null;
  }[],
} as const;

export type PipelineStage = {
  title: string;
  body: string;
  /** Visuel réel (lot F du brief Codex, ou capture studio) ; null =
      placeholder dégradé. */
  image: ImageSlot | null;
};

export type ProgressState = {
  label: string;
  image: ImageSlot | null;
};

/** Pipeline « du réel au jumeau numérique » (Funnel V2, réf. PDF boss
    p15) + comparaison d'avancement pour le suivi de chantier. */
export const pipelineLidar = {
  id: "pipeline",
  kicker: "Du réel au jumeau numérique",
  title: "Comprendre le site avant d'agir",
  stages: [
    {
      title: "État réel",
      body: "Le site tel qu'il est, capturé sur place.",
      image: {
        src: "/images/funnel-v2/lidar-scan-trame.webp",
        alt: "Pièce brute balayée par une trame laser verte",
        width: 1200,
        height: 800,
      },
    },
    {
      title: "Nuage de points",
      body: "Des millions de points mesurés : la matière première du projet.",
      image: {
        src: "/images/funnel-v2/lidar-nuage-points.webp",
        alt: "Intérieur de bâtiment restitué en nuage de points verts",
        width: 1200,
        height: 800,
      },
    },
    {
      title: "Jumeau numérique",
      body: "Le site devient consultable, mesurable et comparable.",
      image: {
        src: "/images/funnel-v2/lidar-jumeau-filaire.webp",
        alt: "Bâtiment en filaire 3D vert et cyan sur fond sombre",
        width: 1200,
        height: 800,
      },
    },
  ] as readonly PipelineStage[],
  /** Affordance du scrollytelling (UI, pas une promesse produit). */
  stageHint: "Faites défiler : le scan construit le jumeau",
  /** Flux de données (ex-section « Parlez le langage de l'existant »,
      fusionnée ici : la sortie concrète du jumeau, dite UNE fois). */
  flow: {
    title: "Du terrain à vos logiciels",
    steps: [
      { title: "Capture de l'existant" },
      { title: "Nuage de points" },
      { title: "E57", note: "Format d'échange standard" },
      { title: "CAD / BIM", note: "En option, selon le besoin validé" },
      { title: "Coordination, remise et archivage" },
    ] as readonly { title: string; note?: string }[],
  },
  progressTitle: "Comparaison d'avancement du site",
  progressBody:
    "Un même bâtiment, scanné à plusieurs moments : l'avancement se constate, il ne se discute plus.",
  progressStates: [
    {
      label: "Scan initial",
      image: {
        src: "/images/funnel-v2/lidar-avancement-01.webp",
        alt: "Bâtiment en filaire gris, points de scan épars",
        width: 1200,
        height: 900,
      },
    },
    {
      label: "En cours",
      image: {
        src: "/images/funnel-v2/lidar-avancement-02.webp",
        alt: "Même bâtiment, niveaux inférieurs restitués en points verts",
        width: 1200,
        height: 900,
      },
    },
    {
      label: "Aujourd'hui",
      image: {
        src: "/images/funnel-v2/lidar-avancement-03.webp",
        alt: "Même bâtiment complet en volume bleu technique",
        width: 1200,
        height: 900,
      },
    },
  ] as readonly ProgressState[],
  /** Mentions fidèles au PDF boss, à ne pas reformuler. */
  mentions: [
    "Livrables selon faisabilité et validation technique.",
    "Visualisation illustrative.",
  ],
} as const;

/** Usages : ABSORBE l'ancienne définition (kicker, titre, intro) et la
    liste « à qui » (chips). Les 6 usages de la définition étaient des
    doublons 1:1 des applications : les 7 tuiles font foi. */
export const applicationsLidar = {
  id: "applications",
  kicker: "Qu'est-ce que XR LiDAR Opérationnel ?",
  title: "Votre site existe. Rendez-le exploitable.",
  subtitle:
    "Une prestation professionnelle de captation et de documentation 3D, pour les projets qui exigent une meilleure compréhension de l'existant.",
  items: [
    {
      icon: Building2,
      title: "Relevé de l'existant",
      body: "Documenter un bâtiment, un local ou un espace avant toute nouvelle étude.",
    },
    {
      icon: ClipboardCheck,
      title: "Avant travaux ou rénovation",
      body: "Une base fiable pour comprendre l'état actuel et préparer les interventions.",
    },
    {
      icon: Box,
      title: "Documentation 3D",
      body: "Une référence numérique consultable à tout moment.",
    },
    {
      icon: Camera,
      title: "Suivi visuel de chantier",
      body: "Enregistrer l'évolution du site et assurer une traçabilité claire des travaux.",
    },
    {
      icon: Landmark,
      title: "Patrimoine & bâtiments existants",
      body: "Documenter des sites historiques ou complexes dont les informations sont incomplètes.",
    },
    {
      icon: Factory,
      title: "Industrie & exploitation",
      body: "Capturer l'organisation d'espaces techniques, d'ateliers ou d'installations.",
    },
    {
      icon: FileText,
      title: "Architecture & bureaux d'études",
      body: "Préparer des données exploitables pour la conception, la rénovation ou l'aménagement.",
    },
  ] satisfies readonly IconItem[],
} as const;

/** Mission : timeline resserrée + ABSORBE les engagements (accordéon) et
    les limites légales (bloc VISIBLE, jamais en disclosure) de l'ancienne
    section confiance. Les listes « améliore »/« pourquoi » vivent dans la
    bande réassurance. */
export const missionLidar = {
  id: "mission",
  kicker: "Comment se déroule une mission ?",
  title: "Une donnée fiable commence par un besoin bien défini",
  steps: [
    {
      icon: MessagesSquare,
      title: "Cadrage du besoin",
      body: "Type de bâtiment, surface, zones, objectif, niveau de détail, livrables et logiciels : tout est posé d'entrée.",
    },
    {
      icon: ListChecks,
      title: "Préparation de l'intervention",
      body: "Accès, contraintes, autorisations et conditions de captation évalués avant le déplacement.",
    },
    {
      icon: Crosshair,
      title: "Captation sur le terrain",
      body: "Notre équipe capture les espaces définis avec le matériel adapté.",
    },
    {
      icon: ShieldCheck,
      title: "Contrôle et traitement",
      body: "Les données collectées sont vérifiées, organisées et traitées.",
    },
    {
      icon: Send,
      title: "Livraison",
      body: "Fichiers et supports transmis dans les formats confirmés avec vous.",
    },
  ],
  engagementsTitle: "Nos engagements avant intervention",
  engagements: [
    { title: "Périmètre défini", body: "Bâtiments, pièces et zones à capturer clairement identifiés avant le déplacement." },
    { title: "Niveau de précision confirmé", body: "La précision attendue est déterminée selon le matériel et l'usage final des données." },
    { title: "Formats validés", body: "Les formats de livraison sont confirmés en fonction de vos outils et logiciels." },
    { title: "Délais estimés", body: "Captation, traitement et livraison estimés avant le lancement." },
    { title: "Contraintes prises en compte", body: "Accès, activité du site, luminosité, obstacles, sécurité et conditions techniques étudiés." },
  ],
  /** LÉGAL : repris fidèlement de la brochure, ne pas reformuler, TOUJOURS
      visible (jamais dans un accordéon). Ancre du renvoi du CTA final. */
  limitsId: "limites",
  limitsTitle: "Limites et précisions",
  limits: [
    "La captation LiDAR ne remplace pas une étude structurelle ou un diagnostic réglementaire.",
    "Certaines données ne constituent pas un relevé juridique ou cadastral.",
    "Les tolérances et précisions dépendent du matériel, des conditions de captation et du périmètre défini.",
    "L'intervention d'un géomètre expert est requise lorsque la réglementation ou le contexte l'impose.",
    "Les résultats dépendent également de l'accessibilité, de l'environnement et de l'état du site.",
  ],
  adaptNote: "Nous adaptons la mission à votre projet, à vos contraintes et à vos objectifs réels.",
} as const;

export type DeliverableFamily = {
  id: "donnees-3d" | "plans-modeles" | "documentation";
  label: string;
  items: readonly { title: string; body: string }[];
};

/** Livrables derrière un sélecteur à 3 familles (les 11 tuiles d'un bloc
    étaient illisibles) ; la mention fidèle « validés avant devis » vit ICI,
    en occurrence unique. */
export const deliverablesLidar = {
  id: "livrables",
  kicker: "Nos livrables envisageables",
  title: "Des données précises pour des décisions fiables",
  subtitle: "Définis avant la mission, selon vos besoins, le matériel et vos logiciels.",
  selectorLabel: "Choisir une famille de livrables",
  families: [
    {
      id: "donnees-3d",
      label: "Données 3D",
      items: [
        { title: "Nuage de points", body: "Représentation 3D précise, consultable dans différents logiciels." },
        { title: "Visite 3D", body: "Parcours interactif pour naviguer dans les espaces et comprendre le site." },
        { title: "Jumeau numérique", body: "Référence numérique du bâtiment regroupant données, vues et informations." },
      ],
    },
    {
      id: "plans-modeles",
      label: "Plans et modèles",
      items: [
        { title: "Plans 2D", body: "Plans ou relevés selon le périmètre et le niveau de détail définis." },
        { title: "Modèles / plans 3D", body: "Modélisation des espaces pour une meilleure compréhension des volumes." },
        { title: "Orthophotos", body: "Vues corrigées et exploitables des surfaces ou des zones du projet." },
        { title: "Scan-to-CAD", body: "Données préparées pour la conception assistée par ordinateur." },
        { title: "Scan-to-BIM", body: "Éléments exploitables dans un processus BIM selon le niveau défini." },
        { title: "Exports BIM", body: "Livraison dans les formats confirmés avant la mission (IFC, RVT…)." },
      ],
    },
    {
      id: "documentation",
      label: "Documentation",
      items: [
        { title: "Documentation photographique", body: "Images organisées par zones pour une trace visuelle complète." },
        { title: "Audit / dossier complet", body: "Données, plans, vues et documents regroupés selon la prestation." },
      ],
    },
  ] satisfies readonly DeliverableFamily[],
  /** Mention fidèle au PDF boss, à ne pas reformuler (occurrence unique). */
  mention: "Formats, tolérances et livrables validés avant devis.",
} as const;

/** Section Offres : le catalogue (2 familles × 3 solutions) vit dans
    config/offers.ts. La note de périmètre sépare explicitement la famille
    commerciale (scan Matterport, montrer un lieu) de XR 360 (captation photo
    360°) : sans elle, deux prix d'entrée voisins sur deux pages du site
    donneraient l'impression de vendre deux fois la même chose. */
export const offersLidar = {
  id: "offres",
  kicker: "Nos offres",
  title: "Deux familles, trois solutions chacune",
  subtitle:
    "Montrer un lieu ou mesurer un existant ne demandent ni le même travail, ni les mêmes livrables. Tarifs « à partir de », sur devis selon le périmètre, la surface et les livrables.",
  selectorLabel: "Choisissez une famille d'offres",
  hint: "Cliquez sur une famille et les solutions s'adaptent.",
  panelIntroPrefix: "Voici les solutions",
  pricePrefix: "à partir de",
  cta: "Choisir cette solution",
  optionsLabel: "Options et suppléments",
  note: {
    title: "Deux besoins, deux métiers",
    body: "Les solutions commerciales numérisent votre lieu en 3D pour le montrer et le vendre. Les solutions techniques produisent des données de relevé pour vos études, vos plans et vos modèles.",
    bridge: "Pour une visite virtuelle en photo 360°, plus légère à produire :",
  },
} as const;

/** CTA final : ABSORBE la zone d'intervention (la portée géographique au
    moment de la décision) ; la mention légale devient un renvoi vers le
    bloc limites (une seule occurrence du texte fidèle, dans la mission). */
export const finalCtaLidar = {
  kicker: "Passons à votre site",
  title: "De votre site aux données, il n'y a qu'un brief.",
  subtitle:
    "Présentez-nous votre site, vos objectifs et les livrables attendus. Notre équipe évalue votre besoin et prépare une intervention adaptée : le formulaire est juste en dessous.",
  zonesTitle: "Zone d'intervention",
  zones: [
    "Madagascar",
    "Réunion",
    "Maurice",
    "Mayotte",
    "Comores",
    "Seychelles",
    "Afrique de l'Est",
    "Afrique australe",
    "France",
    "Indonésie",
  ],
  zonesNote: "Selon la nature et la faisabilité du projet.",
  cta: "Présenter mon site",
  ctaTargetId: "brief",
  limitsNote: "Les limites et précisions de la prestation sont détaillées dans la section mission.",
  limitsTargetId: "limites",
} as const;

export const footerLidar = {
  baseline:
    "Relevé 3D et reality capture : vos bâtiments, espaces et sites existants transformés en données numériques structurées et exploitables.",
  contactTitle: "Contact",
  homeLabel: "XR Technologie, tous les pôles",
  privacyLabel: "Politique de confidentialité",
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;

