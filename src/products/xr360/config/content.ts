import {
  Building2,
  Camera,
  Clapperboard,
  Globe,
  Headset,
  Layers,
  Link2,
  Mail,
  MapPin,
  MessagesSquare,
  Monitor,
  MonitorPlay,
  Plane,
  QrCode,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Tablet,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { ImageSlot, VideoSlot } from "@/lib/images";

/**
 * Contenu du funnel XR 360 (visite virtuelle & valorisation immersive).
 * SOURCE DE VÉRITÉ : la brochure officielle
 * `docs/Utils/XR 360 & Visite virtuelle.pdf` (fond fidèle, copy réécrit
 * neuro-marketing). Aucun prix : le parcours est un brief projet
 * (« Créer une visite virtuelle », composant signature de la charte).
 * Prestations complémentaires (drone, Insta 360, montage YouTube, Google
 * Maps) EN ATTENTE de leurs brochures : liste extensible, voir TODO.md.
 */

/** Lockup officiel XR 360 (docs/logo, détouré en alpha) : navbar et footer. */
export const logo360: ImageSlot = {
  src: "/images/logo-xr-360.webp",
  alt: "XR 360, visite virtuelle",
  width: 357,
  height: 96,
};

/* Navigation interne par scrollTo (aucune ancre d'URL) : id = id de section. */
export const nav360 = [
  { label: "Démo", id: "demo" },
  { label: "Prestations", id: "prestations" },
  { label: "Série", id: "serie" },
  { label: "Déroulement", id: "deroulement" },
  { label: "Offres", id: "offres" },
] as const;

export const hero360 = {
  kicker: "XR 360 · Visite virtuelle & valorisation immersive",
  titleLead: "Votre client peut imaginer le lieu.",
  titleAccent: "Ou déjà commencer à le visiter.",
  baseline: "Montrer. Visiter. Valoriser.",
  cta: "Créer une visite virtuelle",
  ctaTargetId: "brief",
  /** Fond du hero (lot D) : opérateur en captation dans le lobby, sujet à
      droite, zone texte sombre à gauche. Priority : re-mesurer le LCP à
      chaque changement de visuel. */
  image: {
    src: "/images/funnel-v2/xr360-hero-captation.webp",
    alt: "Opérateur captant un lobby d'hôtel avec une caméra 360 sur perche",
    width: 1600,
    height: 1000,
  } as ImageSlot | null,
  chips: [
    { icon: Globe, label: "Panoramas 360°" },
    { icon: Camera, label: "Photos & vidéos 360°" },
    { icon: Headset, label: "Casque VR" },
    { icon: Monitor, label: "Tous vos supports" },
  ],
} as const;

export type IconItem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/** Bande atouts (respiration façon /vr) : les bénéfices se LISENT d'un coup
    d'œil, la preuve se VIT dans la fenêtre 360 juste en dessous. */
export const benefits360 = {
  id: "atouts",
  ariaLabel: "Atouts XR 360",
  items: [
    { icon: Globe, label: "Faire découvrir à distance" },
    { icon: Layers, label: "Faciliter la projection" },
    { icon: Building2, label: "Valoriser l'établissement" },
    { icon: Share2, label: "Partager partout" },
  ],
} as const;

export type ServiceFamily = {
  id: "captation" | "experience" | "diffusion";
  label: string;
  intro: string;
  items: readonly IconItem[];
  /** Livrables envisageables de la famille (fond brochure + PDF V2), dits
      UNE seule fois sur la page : ici, avec la prestation qui les produit. */
  deliverables: readonly string[];
};

/** Les 8 prestations regroupées en 3 familles derrière un sélecteur (une
    famille visible à la fois : disclosure façon /vr). Absorbe l'ancienne
    liste séparée des livrables et l'idée du hub « une captation, plusieurs
    formats ». */
export const services360 = {
  id: "prestations",
  kicker: "Une captation, plusieurs formats",
  title: "Un lieu réel, une expérience immersive",
  subtitle:
    "Trois familles de prestations qui se complètent : choisissez votre angle, les livrables suivent.",
  selectorLabel: "Choisir une famille de prestations",
  deliverablesLabel: "Livrables envisageables",
  families: [
    {
      id: "captation",
      label: "Captation",
      intro: "La matière première : votre lieu saisi dans toutes les directions.",
      items: [
        {
          icon: Camera,
          title: "Captation photo 360°",
          body: "Des vues panoramiques haute qualité pour observer chaque espace dans toutes les directions.",
        },
        {
          icon: Video,
          title: "Captation vidéo 360°",
          body: "Des séquences immersives qui donnent la sensation d'être présent dans l'environnement filmé.",
        },
        {
          icon: Plane,
          title: "Film FPV au drone",
          body: "Un survol dynamique du lieu au drone DJI Avata : le format spectaculaire qui complète la visite.",
        },
      ],
      deliverables: ["Photographies panoramiques 360°", "Séquences vidéo 360°", "Film FPV au drone"],
    },
    {
      id: "experience",
      label: "Expérience",
      intro: "La captation devient un parcours que votre visiteur explore librement.",
      items: [
        {
          icon: MapPin,
          title: "Création de visite virtuelle",
          body: "Vos espaces organisés en parcours interactif fluide et intuitif, avec points d'intérêt et navigation libre.",
        },
        {
          icon: Headset,
          title: "Présentation en casque VR",
          body: "Une immersion totale pour vos rendez-vous et présentations : l'expérience la plus réaliste qui soit.",
        },
      ],
      deliverables: [
        "Visite virtuelle interactive",
        "Lien de consultation",
        "Présentation immersive casque VR",
      ],
    },
    {
      id: "diffusion",
      label: "Diffusion",
      intro: "L'expérience part à la rencontre de votre public, sur ses écrans.",
      items: [
        {
          icon: Clapperboard,
          title: "Vidéo 360 en ligne",
          body: "Vos séquences publiées et consultables en ligne : le lieu se visite depuis n'importe où, à tout moment.",
        },
        {
          icon: Smartphone,
          title: "Formats réseaux sociaux",
          body: "Des extraits verticaux taillés pour vos réseaux : votre lieu se découvre aussi dans le fil de votre public.",
        },
        {
          icon: Share2,
          title: "Intégration digitale",
          body: "Des contenus prêts à être intégrés sur votre site, vos réseaux sociaux ou vos campagnes digitales.",
        },
      ],
      deliverables: [
        "Intégration site internet",
        "Extraits pour communication digitale",
        "Supports de présentation commerciaux",
      ],
    },
  ] satisfies readonly ServiceFamily[],
} as const;

/** Scène de la fenêtre 360 (fx Pano360Window) : hotspots en coordonnées
    image (u,v ∈ 0..1). `projection: "sphere"` le jour où l'équirectangulaire
    réelle (lot G) remplace la photo large : aucun changement de code. */
export type PanoSceneContent = {
  id: string;
  label: string;
  image: ImageSlot;
  projection?: "cylinder" | "sphere";
  arcDeg?: number;
  hotspots: readonly { u: number; v: number; label: string }[];
};

/** Démo exploration 3D (Funnel V2, réf. PDF boss p10) : la fenêtre 360
    interactive fait VIVRE l'expérience sur des images illustratives (la
    mention l'assume) ; le viewer réel se branche via embedUrl quand la
    captation démo existera (demande studio n°1) et reste PRIORITAIRE. */
export const demo360 = {
  id: "demo",
  kicker: "La preuve par l'exploration",
  title: "Explorez le lieu comme si vous y étiez",
  subtitle:
    "Points interactifs, navigation libre, partage en un lien : voilà ce que votre visiteur vivra.",
  features: [
    { icon: MapPin, label: "Points interactifs" },
    { icon: Smartphone, label: "Compatible mobile" },
    { icon: Link2, label: "Lien partageable" },
  ],
  embedUrl: null as string | null,
  /** Ambiance du cadre viewer tant que embedUrl est null (lot D Codex,
      illustratif : la mention l'assume). Sert aussi de repli à la fenêtre. */
  preview: {
    src: "/images/funnel-v2/xr360-pano-lobby.webp",
    alt: "Lobby d'hôtel tropical au crépuscule, vue panoramique",
    width: 1920,
    height: 960,
  } as ImageSlot | null,
  /** Équirectangulaires seamless (lot G Codex, contrôlées + raccord fondu) :
      la fenêtre tourne en SPHÈRE COMPLÈTE, regard libre à 360°. */
  panoScenes: [
    {
      id: "lobby",
      label: "Accueil",
      projection: "sphere",
      image: {
        src: "/images/funnel-v2/xr360-equi-lobby.webp",
        alt: "Lobby d'hôtel tropical au crépuscule, panorama 360",
        width: 4096,
        height: 2048,
      },
      hotspots: [
        { u: 0.5, v: 0.52, label: "Réception" },
        { u: 0.13, v: 0.6, label: "Salon" },
        { u: 0.88, v: 0.5, label: "Piscine" },
      ],
    },
    {
      id: "chambre",
      label: "Chambre",
      projection: "sphere",
      image: {
        src: "/images/funnel-v2/xr360-equi-chambre.webp",
        alt: "Chambre de lodge avec moustiquaire, panorama 360",
        width: 4096,
        height: 2048,
      },
      hotspots: [
        { u: 0.22, v: 0.55, label: "Espace nuit" },
        { u: 0.5, v: 0.5, label: "Vue extérieure" },
      ],
    },
    {
      id: "restaurant",
      label: "Restaurant",
      projection: "sphere",
      image: {
        src: "/images/funnel-v2/xr360-equi-restaurant.webp",
        alt: "Salle de restaurant chaleureuse, panorama 360",
        width: 4096,
        height: 2048,
      },
      hotspots: [
        { u: 0.5, v: 0.6, label: "Salle" },
        { u: 0.14, v: 0.58, label: "Tables côté mer" },
      ],
    },
  ] satisfies readonly PanoSceneContent[],
  panoHint: "Glissez pour regarder autour",
  panoGyroCta: "Activer le gyroscope",
  /** Chips « pour qui » au-dessus de la fenêtre (ex-section Lieux, dont les
      7 types sont conservés : les descriptions redisaient la démo). */
  placesLabel: "Pour tous types de lieux",
  places: [
    "Hôtels & hébergements",
    "Immobilier",
    "Restaurants",
    "Commerces & showrooms",
    "Écoles & formations",
    "Sites culturels & patrimoniaux",
    "Entreprises",
  ],
  placeholderTitle: "Votre lieu, exploré à 360°",
  placeholderNote:
    "Illustration interactive : demandez une visite pilote, nous vous montrons l'expérience sur VOTRE lieu.",
  cta: "Demander une visite pilote",
  ctaTargetId: "brief",
  mention: "Visualisation illustrative",
} as const;

export type Episode = {
  title: string;
  body: string;
  /** Vignette d'épisode (lot E Codex) ; null = panneau sans visuel. */
  image: ImageSlot | null;
};

/** Série immersive (Funnel V2, réf. PDF boss p11) : le canal vidéo 360
    récurrent, au-delà de la visite ponctuelle. */
export const series360 = {
  id: "serie",
  kicker: "Le format récurrent",
  title: "Transformez votre lieu en série immersive",
  subtitle: "Un rendez-vous vidéo 360 qui raconte votre lieu, épisode après épisode.",
  episodes: [
    {
      title: "L'arrivée",
      body: "Le premier pas dans votre lieu, comme si on y était.",
      image: {
        src: "/images/funnel-v2/xr360-episode-arrivee.webp",
        alt: "Allée d'entrée d'un lodge éclairée de lanternes au crépuscule",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Vue aérienne",
      body: "Votre lieu dans son écrin, vu du ciel.",
      image: {
        src: "/images/funnel-v2/xr360-episode-vue-aerienne.webp",
        alt: "Lagon turquoise et resort vus du ciel à la tombée du jour",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Visite guidée 360°",
      body: "Le tour du propriétaire, mené comme une histoire.",
      image: {
        src: "/images/funnel-v2/xr360-episode-resort.webp",
        alt: "Piscine à débordement d'un resort face à la mer au crépuscule",
        width: 960,
        height: 540,
      },
    },
    {
      title: "La villa",
      body: "L'espace signature qui fait rêver et réserver.",
      image: {
        src: "/images/funnel-v2/xr360-episode-villa.webp",
        alt: "Villa sur pilotis éclairée de nuit au-dessus de l'eau",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Coulisses et savoir-faire",
      body: "Les gestes et les équipes qui font vivre le lieu.",
      image: {
        src: "/images/funnel-v2/xr360-episode-coulisses.webp",
        alt: "Chef dressant une assiette en cuisine sous une lampe",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Expériences",
      body: "Ce que vos visiteurs vivront, montré avant qu'ils réservent.",
      image: {
        src: "/images/funnel-v2/xr360-episode-experiences.webp",
        alt: "Deux kayaks sur une eau calme au coucher du soleil",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Destination et patrimoine",
      body: "Ce qui entoure votre lieu et donne envie du voyage.",
      image: {
        src: "/images/funnel-v2/xr360-episode-baobabs.webp",
        alt: "Allée des baobabs au coucher du soleil",
        width: 960,
        height: 540,
      },
    },
    {
      title: "Évolution d'un projet",
      body: "Un chantier ou une rénovation racontés dans le temps.",
      image: {
        src: "/images/funnel-v2/xr360-episode-chantier.webp",
        alt: "Structure en bois d'un bungalow en construction face à la mer",
        width: 960,
        height: 540,
      },
    },
  ] as readonly Episode[],
  cta: "Créer ma chaîne immersive",
  ctaTargetId: "brief",
} as const;

/** Section Offres : le catalogue (3 offres chiffrées × 8 cibles) vit dans
    config/offers.ts, source docs/Nouvelle_brochure/XR 360 - BROCHURE.pdf.
    La note de périmètre trace la frontière avec les offres commerciales
    LiDAR : XR 360 = captation photo 360°, XR Reality Capture = scan 3D
    Matterport ; deux prix d'entrée voisins, deux prestations différentes. */
export const offers360 = {
  id: "offres",
  kicker: "Nos offres",
  title: "Trois offres pour montrer, visiter et valoriser votre lieu",
  subtitle:
    "Chaque lieu a des besoins différents : choisissez votre univers, on vous recommande le bon format. Tarifs « à partir de », selon la surface, le nombre de zones et les livrables.",
  selectorLabel: "Choisissez votre type de lieu",
  hint: "Cliquez sur votre univers et les offres s'adaptent.",
  panelIntroPrefix: "Nos trois offres pour",
  pricePrefix: "à partir de",
  cta: "Choisir cette offre",
  reassurance: [
    { icon: Users, label: "Accompagnement de A à Z" },
    { icon: ShieldCheck, label: "Données sécurisées" },
    { icon: Layers, label: "Livrables exploitables et évolutifs" },
  ],
  /** Options complémentaires de la brochure : sans prix, en pied de section. */
  optionsTitle: "Options complémentaires",
  options: [
    "Intégration sur votre site internet",
    "Extraits pour réseaux sociaux",
    "Support de présentation",
    "Lien pour campagne publicitaire",
    "Adaptation pour funnel ou page de vente",
  ],
  /** Périmètre (ex-Clarification360, condensé fidèle à la règle charte :
      jamais de promesse de mesure côté 360) + passerelle LiDAR. */
  note: {
    title: "Périmètre clair",
    body: "XR 360 présente et valorise un lieu par la photo 360° : une prestation d'image immersive. Elle ne promet ni scan 3D, ni mesures techniques, ni plans, ni nuages de points.",
    bridge: "Pour un scan 3D Matterport, des relevés métriques, Scan-to-CAD et Scan-to-BIM :",
  },
} as const;

export const process360 = {
  id: "deroulement",
  kicker: "Comment se déroule une intervention",
  title: "Vous connaissez votre lieu. Nous organisons sa découverte.",
  subtitle: "Que doit comprendre, ressentir, découvrir votre visiteur ? Tout part de là.",
  steps: [
    {
      icon: MessagesSquare,
      title: "Vous présentez votre projet",
      body: "Nous échangeons sur votre établissement, vos espaces, vos objectifs et votre public cible.",
    },
    {
      icon: MapPin,
      title: "Nous préparons le parcours",
      body: "Les zones importantes sont identifiées et le parcours de visite est organisé pour offrir une expérience fluide et intuitive.",
    },
    {
      icon: Camera,
      title: "Notre équipe réalise la captation",
      body: "Les photos et vidéos 360° sont capturées sur place avec du matériel professionnel, dans les meilleures conditions.",
    },
    {
      icon: MonitorPlay,
      title: "Nous construisons l'expérience",
      body: "Les contenus sont sélectionnés, organisés et enrichis pour créer une visite immersive cohérente et agréable à parcourir.",
    },
    {
      icon: Send,
      title: "La visite est livrée et diffusée",
      body: "Le contenu est prêt à être consulté et partagé selon les supports définis ensemble.",
    },
  ],
} as const;

/** Diffusion (recentrée) : LA seule liste « où ça se voit » de la page ;
    les livrables détaillés vivent avec leur famille de prestation. */
export const deliverables360 = {
  id: "livrables",
  kicker: "Diffusion et partage",
  title: "Une captation, tous vos supports",
  diffusionTitle: "Diffusion et compatibilité",
  /** Mockups devices (pattern validé sur /fx-lab) : les écrans affichent
      les panoramas du lot D, la preuve que la même captation vit sur tous
      les supports. */
  mockups: {
    laptop: {
      src: "/images/funnel-v2/xr360-pano-restaurant.webp",
      alt: "Visite virtuelle d'un restaurant affichée sur un ordinateur portable",
      width: 1920,
      height: 960,
    } as ImageSlot | null,
    phone: {
      src: "/images/funnel-v2/xr360-pano-chambre.webp",
      alt: "La même visite consultée sur un smartphone",
      width: 1920,
      height: 960,
    } as ImageSlot | null,
  },
  mockupLaptopLabel: "Visite interactive, expérience complète",
  mockupPhoneLabel: "Mobile",
  diffusion: [
    { icon: Monitor, label: "Ordinateur", note: "Expérience complète" },
    { icon: Smartphone, label: "Smartphone", note: "Accessible partout" },
    { icon: Tablet, label: "Tablette", note: "Navigation fluide" },
    { icon: Headset, label: "Casque VR", note: "Immersion totale" },
  ],
  shareTitle: "Intégration et partage",
  share: [
    { icon: Link2, label: "Intégration web" },
    { icon: Share2, label: "Réseaux sociaux" },
    { icon: Mail, label: "Envoi par email" },
    { icon: QrCode, label: "QR code" },
  ],
} as const;

export const finalCta360 = {
  /** Vitrine vidéo (docs/Video, montage promo portrait 4:5) : remplace
      l'ambiance lodge du lot D. Convertie par ffmpeg (VP9/WebM + H.264/MP4,
      900px, lazy après first paint), même système que la vitrine VR. */
  video: {
    webm: "/videos/visite-360.webm",
    mp4: "/videos/visite-360.mp4",
    poster: {
      src: "/videos/visite-360-poster.webp",
      alt: "Démonstration de captation 360 : la rue entière en vue sphérique",
      width: 900,
      height: 1126,
    },
  } satisfies VideoSlot,
  soundOnLabel: "Activer le son",
  soundOffLabel: "Couper le son",
  title: "Votre lieu mérite plus qu'une photo.",
  lines: ["Faites-le visiter.", "Faites-le comprendre.", "Faites-le vivre à distance."],
  subtitle:
    "Présentez-nous votre établissement et les espaces que vous souhaitez valoriser. Nous préparons le reste : le formulaire de brief est juste en dessous.",
  cta: "Créer une visite virtuelle",
  ctaTargetId: "brief",
} as const;

export const footer360 = {
  baseline:
    "Visites virtuelles et valorisation immersive : votre lieu devient accessible, visible et valorisable à distance.",
  contactTitle: "Contact",
  homeLabel: "XR Technologie, tous les pôles",
  privacyLabel: "Politique de confidentialité",
  legalLabel: "Mentions légales",
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;
