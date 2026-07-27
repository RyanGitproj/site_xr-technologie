import {
  Building2,
  Camera,
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
  QrCode,
  Send,
  Share2,
  Smartphone,
  Store,
  Tablet,
  UtensilsCrossed,
  Video,
  type LucideIcon,
} from "lucide-react";

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
  { label: "Livrables", id: "livrables" },
] as const;

export const hero360 = {
  kicker: "XR 360 · Visite virtuelle & valorisation immersive",
  titleLead: "Votre client peut imaginer le lieu.",
  titleAccent: "Ou déjà commencer à le visiter.",
  subtitle:
    "XR 360 transforme votre établissement en une visite immersive accessible à distance, depuis un téléphone, un ordinateur ou un casque VR. Votre public ne regarde plus le lieu : il commence à l'explorer.",
  baseline: "Montrer. Visiter. Valoriser.",
  cta: "Créer une visite virtuelle",
  ctaTargetId: "brief",
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
      icon: Share2,
      title: "Intégration digitale",
      body: "Des contenus prêts à être intégrés sur votre site, vos réseaux sociaux ou vos campagnes digitales.",
    },
  ] satisfies readonly IconItem[],
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
