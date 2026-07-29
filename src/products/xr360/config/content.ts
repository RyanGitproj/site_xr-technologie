import {
  Building2,
  Camera,
  Clapperboard,
  GraduationCap,
  Globe,
  Headset,
  Hotel,
  Landmark,
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
  Store,
  Tablet,
  Users,
  UtensilsCrossed,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { ImageSlot } from "@/lib/images";
import type { Brief } from "@/products/xr360/lib/brief";

/**
 * Contenu du funnel XR 360 (visite virtuelle & valorisation immersive).
 * SOURCE DE VÉRITÉ : la brochure officielle
 * `docs/Utils/XR 360 & Visite virtuelle.pdf` (fond fidèle, copy réécrit
 * neuro-marketing). Aucun prix : le parcours est un brief projet
 * (« Créer une visite virtuelle », composant signature de la charte).
 * Prestations complémentaires (drone, Insta 360, montage YouTube, Google
 * Maps) EN ATTENTE de leurs brochures : liste extensible, voir TODO.md.
 */

/* Navigation interne par scrollTo (aucune ancre d'URL) : id = id de section. */
export const nav360 = [
  { label: "Atouts", id: "atouts" },
  { label: "Prestations", id: "prestations" },
  { label: "Lieux", id: "lieux" },
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

export const benefits360 = {
  id: "atouts",
  kicker: "Montrer. Visiter. Valoriser.",
  title: "Ce que la visite change pour vous",
  items: [
    {
      icon: Globe,
      title: "Faire découvrir à distance",
      body: "Vos prospects, clients et partenaires explorent votre établissement sans se déplacer : la première visite a déjà eu lieu.",
    },
    {
      icon: Layers,
      title: "Faciliter la projection",
      body: "Volumes, organisation des espaces, ambiance : le visiteur comprend le lieu et s'y projette au lieu de l'imaginer.",
    },
    {
      icon: Building2,
      title: "Valoriser votre établissement",
      body: "Hôtel, bien immobilier, restaurant ou locaux : votre lieu se présente avec un support moderne et immersif.",
    },
    {
      icon: Share2,
      title: "Partager facilement",
      body: "La visite s'intègre à votre communication digitale et se diffuse auprès de votre public sur tous les supports.",
    },
  ] satisfies readonly IconItem[],
} as const;

export const services360 = {
  id: "prestations",
  kicker: "Nos prestations XR 360",
  title: "Un lieu réel, une expérience immersive",
  subtitle:
    "XR 360 ne se limite pas à prendre des photos : nous créons une visite qui permet à votre public de comprendre, d'explorer et de se projeter.",
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
  ] satisfies readonly IconItem[],
} as const;

/** Hub des formats (Funnel V2, réf. PDF boss p9) : une seule captation
    alimente tous les usages, FPV et 360 sont complémentaires. */
export const hub360 = {
  id: "experiences",
  kicker: "Une captation, plusieurs formats",
  title: "Un lieu. Plusieurs expériences.",
  subtitle:
    "Le film FPV et la vidéo 360 ne se remplacent pas, ils se complètent : une même captation alimente votre site, vos rendez-vous commerciaux, vos réseaux et le casque.",
  center: "Votre lieu",
  satellites: [
    "Captation 360°",
    "Film FPV",
    "Visite interactive",
    "Vidéo 360 en ligne",
    "Présentation Quest 3",
    "Formats sociaux",
  ],
} as const;

/** Démo exploration 3D (Funnel V2, réf. PDF boss p10) : le viewer réel se
    branche via embedUrl quand la captation démo existera (demande studio
    n°1) ; en attendant, cadre d'attente honnête + CTA visite pilote. */
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
      illustratif : la mention l'assume). */
  preview: {
    src: "/images/funnel-v2/xr360-pano-lobby.webp",
    alt: "Lobby d'hôtel tropical au crépuscule, vue panoramique",
    width: 1920,
    height: 960,
  } as ImageSlot | null,
  placeholderTitle: "Votre lieu, exploré à 360°",
  placeholderNote:
    "Notre visite de démonstration arrive. En attendant, demandez une visite pilote : nous vous montrons l'expérience sur VOTRE lieu.",
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
  subtitle:
    "Plus qu'une visite : un rendez-vous vidéo 360 qui raconte votre lieu épisode après épisode, inspire votre public et le fait revenir.",
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
  diffusionTitle: "Une série, tous vos canaux",
  diffusion: [
    { icon: Globe, label: "Web" },
    { icon: MonitorPlay, label: "Vidéo 360 en ligne" },
    { icon: Headset, label: "Quest 3" },
    { icon: Monitor, label: "Écrans" },
    { icon: Smartphone, label: "Formats sociaux" },
  ],
  cta: "Créer ma chaîne immersive",
  ctaTargetId: "brief",
} as const;

export type Offer360Id = "visite-business" | "experience-360" | "signature-fpv-quest";

export type Offer360 = {
  /** Id stable (présélection du brief, tracking) : ne jamais renommer. */
  id: Offer360Id;
  name: string;
  tagline: string;
  features: readonly string[];
  /** Offre mise en avant (cadre accentué). */
  featured?: boolean;
  /** Supports du brief présélectionnés au choix de l'offre. */
  supports: readonly Brief["supports"][number][];
};

/** Trois niveaux d'offre sur devis (Funnel V2, réf. PDF boss p12). Règle
    inchangée : aucun prix, chaque projet est chiffré après brief. */
export const offers360 = {
  id: "offres",
  kicker: "Trois niveaux, sur devis",
  title: "Jusqu'où voulez-vous faire vivre votre lieu ?",
  subtitle:
    "Chaque niveau reprend le précédent et l'amplifie. Aucun tarif imposé : chaque lieu est différent, chaque projet est chiffré sur devis, après échange.",
  priceLabel: "Sur devis",
  chooseCta: "Choisir ce niveau",
  items: [
    {
      id: "visite-business",
      name: "Visite Business interactive",
      tagline: "Visite web, points interactifs et QR code",
      features: [
        "Visite web immersive",
        "Points d'intérêt",
        "QR code",
        "Partage facile",
      ],
      supports: ["site-internet", "email-qr"],
    },
    {
      id: "experience-360",
      name: "Expérience 360 immersive",
      tagline: "Vidéo 360, narration et diffusion en ligne",
      features: [
        "Vidéo 360°",
        "Narration et hotspots",
        "Diffusion en ligne",
        "Analyses de vues",
      ],
      featured: true,
      supports: ["site-internet", "reseaux-sociaux"],
    },
    {
      id: "signature-fpv-quest",
      name: "Signature 360 + FPV + Quest 3",
      tagline: "Film FPV, expérience 360 et démonstration en casque",
      features: [
        "Film FPV au drone",
        "Vidéo 360°",
        "Expérience en casque Quest 3",
        "Démonstration commerciale impactante",
      ],
      supports: ["reseaux-sociaux", "casque-vr"],
    },
  ] as readonly Offer360[],
  reassurance: [
    { icon: Users, label: "Accompagnement de A à Z" },
    { icon: ShieldCheck, label: "Données sécurisées" },
    { icon: Layers, label: "Livrables exploitables et évolutifs" },
  ],
  pilotCta: "Demander une visite pilote",
  pilotTargetId: "brief",
} as const;

export const places360 = {
  id: "lieux",
  kicker: "Pour tous types de lieux",
  title: "Votre lieu mérite d'être exploré",
  items: [
    {
      icon: Hotel,
      title: "Hôtels & hébergements",
      body: "Faites découvrir vos chambres, vos espaces communs et votre environnement avant la réservation.",
    },
    {
      icon: Building2,
      title: "Immobilier",
      body: "Valorisez vos biens, maisons, appartements, villas ou programmes immobiliers.",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurants",
      body: "Présentez votre salle, votre terrasse et l'ambiance de votre établissement.",
    },
    {
      icon: Store,
      title: "Commerces & showrooms",
      body: "Mettez en valeur vos espaces, vos produits et votre expérience client.",
    },
    {
      icon: GraduationCap,
      title: "Écoles & formations",
      body: "Faites découvrir vos salles, vos équipements et votre environnement pédagogique.",
    },
    {
      icon: Landmark,
      title: "Sites culturels & patrimoniaux",
      body: "Partagez vos lieux, votre histoire et votre patrimoine avec le plus grand nombre.",
    },
    {
      icon: Building2,
      title: "Entreprises",
      body: "Présentez vos bureaux, vos locaux, votre siège ou vos espaces professionnels.",
    },
  ] satisfies readonly IconItem[],
  visitorTitle: "Ce que votre visiteur peut faire",
  visitorItems: [
    "Observer chaque espace à 360°",
    "Se déplacer librement d'une zone à l'autre",
    "Suivre un parcours complet et structuré",
    "Comprendre les volumes et l'agencement",
    "Se projeter avant de se déplacer",
    "Partager la visite en quelques clics",
    "Consulter à distance, depuis n'importe quel appareil",
  ],
} as const;

export const process360 = {
  id: "deroulement",
  kicker: "Comment se déroule une intervention",
  title: "Vous connaissez votre lieu. Nous organisons sa découverte.",
  subtitle:
    "Chaque projet commence par une question simple : que doit comprendre, ressentir ou découvrir votre visiteur ? À partir de cet objectif, XR 360 prépare un parcours adapté à votre lieu, votre public et vos supports de diffusion.",
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

export const deliverables360 = {
  id: "livrables",
  kicker: "Livrables envisageables",
  title: "Une captation, tous vos supports",
  items: [
    "Photographies panoramiques 360°",
    "Séquences vidéo 360°",
    "Visite virtuelle interactive",
    "Lien de consultation",
    "Intégration site internet",
    "Présentation immersive casque VR",
    "Extraits pour communication digitale",
    "Supports de présentation commerciaux",
  ],
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

/** Clarification de périmètre (règle centrale de la charte : jamais de
    promesse de mesure côté 360). Passerelle vers le pôle LiDAR. */
export const clarification360 = {
  title: "Clarification importante",
  body: "XR 360 permet de visiter et de valoriser un lieu : c'est une prestation de présentation immersive et de communication visuelle. Elle ne promet ni mesures techniques, ni plans, ni nuages de points.",
  bridge:
    "Les relevés métriques, nuages de points, Scan-to-CAD et Scan-to-BIM relèvent d'un pôle distinct : XR LiDAR Opérationnel.",
} as const;

export const finalCta360 = {
  kicker: "Montrer. Visiter. Valoriser.",
  /** Fond d'ambiance (lot D, chambre de lodge) : voilé fort, le texte
      reste le sujet. */
  image: {
    src: "/images/funnel-v2/xr360-pano-chambre.webp",
    alt: "",
    width: 1920,
    height: 960,
  } as ImageSlot | null,
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
  mentions: "© 2026 XR Technologie · Antananarivo, Madagascar",
} as const;
