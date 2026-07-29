import {
  Box,
  Building2,
  Camera,
  ClipboardCheck,
  Clock,
  Crosshair,
  Factory,
  FileCheck2,
  FileText,
  Landmark,
  Layers,
  LineChart,
  ListChecks,
  Map,
  MessagesSquare,
  Plane,
  Ruler,
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
  { label: "Bénéfices", id: "benefices" },
  { label: "Acquisition", id: "acquisition" },
  { label: "Applications", id: "applications" },
  { label: "Mission", id: "mission" },
  { label: "Livrables", id: "livrables" },
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

export const definitionLidar = {
  kicker: "Qu'est-ce que XR LiDAR Opérationnel ?",
  title: "Votre site existe. Rendez-le exploitable.",
  body: "Une prestation professionnelle de captation et de documentation 3D, pensée pour les projets qui exigent une meilleure compréhension de l'existant. Selon le besoin validé, notre intervention vous permet de :",
  usages: [
    "Relever un bâtiment ou un espace",
    "Numériser l'intérieur et l'extérieur d'un site",
    "Conserver un état numérique de l'existant",
    "Préparer un projet de rénovation ou d'aménagement",
    "Documenter visuellement un chantier",
    "Transmettre des données aux architectes et bureaux d'études",
  ],
} as const;

export const benefitsLidar = {
  id: "benefices",
  kicker: "Les 4 bénéfices principaux",
  title: "Du terrain aux données. De l'existant à la décision.",
  items: [
    {
      icon: Ruler,
      title: "Mesurer",
      body: "Les dimensions et la configuration du site, capturées selon le niveau de précision défini pour la mission.",
    },
    {
      icon: Layers,
      title: "Comprendre",
      body: "Une vision plus complète de l'organisation des espaces et de l'état existant, pour tous les intervenants.",
    },
    {
      icon: FileCheck2,
      title: "Documenter",
      body: "Une référence numérique consultable à tout moment, longtemps après l'intervention sur le terrain.",
    },
    {
      icon: Users,
      title: "Coordonner",
      body: "Des échanges facilités entre architectes, bureaux d'études, entreprises, maîtres d'œuvre et exploitants.",
    },
  ] satisfies readonly IconItem[],
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
  title: "Voir le site. Le comprendre. Décider.",
  subtitle:
    "Le mode de captation se choisit selon le site, ses accès et l'objectif : au sol, à la main ou depuis le ciel.",
  modes: [
    {
      icon: ScanLine,
      title: "Acquisition terrestre",
      hardware: "Matterport Pro3",
      note: null,
      body: "Le scanner sur trépied pour les intérieurs et les volumes complexes : la référence de la mission.",
    },
    {
      icon: Smartphone,
      title: "Capture mobile",
      hardware: "iPhone 15 Pro LiDAR",
      note: null,
      body: "La captation légère des zones difficiles d'accès ou des besoins rapides, en complément du scanner.",
    },
    {
      icon: Plane,
      title: "Acquisition aérienne",
      hardware: "Drone LiDAR",
      note: "Selon mission et autorisations",
      body: "Toitures, façades et emprises extérieures, quand le projet le justifie et que le cadre le permet.",
    },
  ] satisfies readonly {
    icon: LucideIcon;
    title: string;
    hardware: string;
    note: string | null;
    body: string;
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
      body: "Une référence numérique consultable, mesurable et comparable.",
      image: {
        src: "/images/funnel-v2/lidar-jumeau-filaire.webp",
        alt: "Bâtiment en filaire 3D vert et cyan sur fond sombre",
        width: 1200,
        height: 800,
      },
    },
  ] as readonly PipelineStage[],
  actions: ["Documenter", "Mesurer", "Comparer"],
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

export type FlowStep = {
  title: string;
  note?: string;
};

/** Flux de données (Funnel V2, réf. PDF boss p16) : de la capture à la
    remise, formats nommés. Les 4 usages du PDF (réhabilitation,
    aménagement, suivi, patrimoine) ne sont PAS repris ici : doublon des
    7 applications déjà en page. */
export const dataFlowLidar = {
  id: "flux",
  kicker: "Parlez le langage de l'existant",
  title: "Des relevés 3D au modèle exploitable",
  subtitle:
    "Un flux de données maîtrisé et traçable, du terrain jusqu'à vos logiciels.",
  steps: [
    { title: "Capture de l'existant" },
    { title: "Nuage de points" },
    { title: "E57", note: "Format d'échange standard" },
    { title: "CAD / BIM", note: "En option, selon le besoin validé" },
    { title: "Coordination, remise et archivage" },
  ] as readonly FlowStep[],
  /** Mention fidèle au PDF boss, à ne pas reformuler. */
  mention: "Formats, tolérances et livrables validés avant devis.",
} as const;

export const applicationsLidar = {
  id: "applications",
  kicker: "Nos principales applications",
  title: "Un relevé, sept terrains d'usage",
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

export const missionLidar = {
  id: "mission",
  kicker: "Comment se déroule une mission ?",
  title: "Une donnée fiable commence par un besoin bien défini",
  steps: [
    {
      icon: MessagesSquare,
      title: "Cadrage du besoin",
      body: "Nous échangeons sur votre projet : type de bâtiment, surface, zones à capturer, objectif, niveau de détail, livrables souhaités et logiciels utilisés.",
    },
    {
      icon: ListChecks,
      title: "Préparation de l'intervention",
      body: "Nous évaluons l'accessibilité du site, les contraintes, les autorisations, la complexité des espaces et les conditions de captation.",
    },
    {
      icon: Crosshair,
      title: "Captation sur le terrain",
      body: "Notre équipe se déplace avec le matériel adapté pour enregistrer les espaces intérieurs, extérieurs ou les zones définies.",
    },
    {
      icon: ShieldCheck,
      title: "Contrôle et traitement",
      body: "Les données collectées sont vérifiées, organisées et traitées selon les livrables validés avant l'intervention.",
    },
    {
      icon: Send,
      title: "Livraison",
      body: "Les fichiers et supports convenus sont préparés et transmis dans les formats confirmés avec vous.",
    },
  ],
  improvementsTitle: "Ce que la captation peut améliorer",
  improvements: [
    "Moins de retours de vérification sur site",
    "Une référence commune pour tous les intervenants",
    "Meilleure compréhension des volumes et des accès",
    "Une trace numérique durable de l'état du bâtiment",
    "Préparation plus efficace des études et des interventions",
    "Traçabilité améliorée à chaque étape du projet",
  ],
} as const;

export const deliverablesLidar = {
  id: "livrables",
  kicker: "Nos livrables envisageables",
  title: "Des données précises pour des décisions fiables",
  subtitle:
    "Les livrables sont définis avant la mission, selon vos besoins, les possibilités techniques, le matériel utilisé et les logiciels dans lesquels les données seront exploitées.",
  items: [
    { title: "Nuage de points", body: "Représentation 3D précise, consultable dans différents logiciels." },
    { title: "Visite 3D", body: "Parcours interactif pour naviguer dans les espaces et comprendre le site." },
    { title: "Documentation photographique", body: "Images organisées par zones pour une trace visuelle complète." },
    { title: "Plans 2D", body: "Plans ou relevés selon le périmètre et le niveau de détail définis." },
    { title: "Modèles / plans 3D", body: "Modélisation des espaces pour une meilleure compréhension des volumes." },
    { title: "Orthophotos", body: "Vues corrigées et exploitables des surfaces ou des zones du projet." },
    { title: "Jumeau numérique", body: "Référence numérique du bâtiment regroupant données, vues et informations." },
    { title: "Scan-to-CAD", body: "Données préparées pour la conception assistée par ordinateur." },
    { title: "Scan-to-BIM", body: "Éléments exploitables dans un processus BIM selon le niveau défini." },
    { title: "Exports BIM", body: "Livraison dans les formats confirmés avant la mission (IFC, RVT…)." },
    { title: "Audit / dossier complet", body: "Données, plans, vues et documents regroupés selon la prestation." },
  ],
} as const;

export const trustLidar = {
  engagementsTitle: "Nos engagements avant intervention",
  engagements: [
    { title: "Périmètre défini", body: "Bâtiments, pièces et zones à capturer clairement identifiés avant le déplacement." },
    { title: "Niveau de précision confirmé", body: "La précision attendue est déterminée selon le matériel et l'usage final des données." },
    { title: "Formats validés", body: "Les formats de livraison sont confirmés en fonction de vos outils et logiciels." },
    { title: "Délais estimés", body: "Captation, traitement et livraison estimés avant le lancement." },
    { title: "Contraintes prises en compte", body: "Accès, activité du site, luminosité, obstacles, sécurité et conditions techniques étudiés." },
  ],
  whyTitle: "Pourquoi choisir XR LiDAR ?",
  why: [
    { icon: Crosshair, title: "Précision et fiabilité", body: "Des données de haute qualité, adaptées à l'usage prévu et au niveau de détail requis." },
    { icon: Clock, title: "Gain de temps", body: "Moins de retours terrain, une meilleure préparation, une coordination simplifiée." },
    { icon: Users, title: "Référence commune", body: "Une base unique compréhensible par tous les intervenants du projet." },
    { icon: FileText, title: "Trace et historique", body: "Une trace numérique fiable de l'état du bâtiment ou du site, dans le temps." },
    { icon: LineChart, title: "Meilleure anticipation", body: "Comprendre l'existant pour mieux planifier études, travaux et interventions." },
  ] satisfies readonly IconItem[],
  /** LÉGAL : repris fidèlement de la brochure, ne pas reformuler. */
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

export const zoneLidar = {
  title: "Zone d'intervention",
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
  note: "Selon la nature et la faisabilité du projet.",
  zoneIcon: Map,
} as const;

export const finalCtaLidar = {
  kicker: "Mesurer. Comprendre. Documenter. Exploiter.",
  title: "Une donnée technique fiable commence par un besoin bien défini.",
  subtitle:
    "Présentez-nous votre site, vos objectifs et les livrables attendus. Notre équipe évalue votre besoin et prépare une intervention adaptée : le formulaire est juste en dessous.",
  cta: "Présenter mon site",
  ctaTargetId: "brief",
  mention:
    "La captation LiDAR ne remplace pas automatiquement une étude structurelle, un diagnostic réglementaire ou l'intervention d'un géomètre expert lorsque celle-ci est légalement requise.",
} as const;

export const footerLidar = {
  baseline:
    "Relevé 3D et reality capture : vos bâtiments, espaces et sites existants transformés en données numériques structurées et exploitables.",
  contactTitle: "Contact",
  homeLabel: "XR Technologie, tous les pôles",
  privacyLabel: "Politique de confidentialité",
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;
