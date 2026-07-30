import {
  Briefcase,
  Building2,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  Home,
  Megaphone,
  Music,
  Plane,
  School,
} from "lucide-react";
import { allPackIds, getGroup, groupLabels, groupPriceFrom } from "@/components/offers/catalog";
import type { OfferGroup, OfferPack } from "@/components/offers/types";

/**
 * Les 10 offres sectorielles et leurs 30 packs. SOURCE DE VÉRITÉ : les
 * brochures officielles docs/Offres/*.pdf pour les 8 premières, et
 * docs/Nouvelle_brochure/*.pdf pour « Jeux & divertissement » et
 * « Musique & rythme » (prix, contenus, badges).
 * Les ids (offres ET packs) alimentent l'enum Zod du formulaire et les
 * colonnes `secteur`/`pack` de funnel_xr_discovery_leads : NE JAMAIS les
 * renommer après mise en prod. Prix toujours « à partir de », en ariary.
 */

export const OFFER_IDS = [
  "centres-commerciaux",
  "entreprise-rh-cse",
  "ecoles-colleges",
  "universite-formation",
  "tourisme-agences",
  "fondations-associations",
  "immobilier-showrooms",
  "marques-evenementiel",
  "jeux-divertissement",
  "musique-rythme",
] as const;

export type OfferId = (typeof OFFER_IDS)[number];

export type Offer = OfferGroup<OfferId>;

export type { OfferPack };

export const OFFERS: readonly Offer[] = [
  {
    id: "centres-commerciaux",
    name: "Centres commerciaux & retail",
    shortName: "Centres commerciaux",
    icon: Building2,
    tagline: "Transformez votre espace en une expérience qui attire, rassemble et fait parler.",
    packs: [
      {
        id: "animation-trafic",
        name: "Animation Trafic",
        tagline: "L'animation découverte qui anime votre lieu.",
        price: 1_600_000,
        features: [
          "3 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Expériences fun & découverte",
        ],
      },
      {
        id: "temps-fort",
        name: "Temps Fort VR",
        tagline: "Le format des temps forts et des week-ends.",
        price: 3_300_000,
        featured: true,
        badge: "Idéal week-ends",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Trafic, photos & souvenirs",
        ],
      },
      {
        id: "pop-up-premium-360",
        name: "Pop-up Premium 360",
        tagline: "La journée complète, format premium.",
        price: 6_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Animation retail + mini récap vidéo",
        ],
      },
    ],
  },
  {
    id: "entreprise-rh-cse",
    name: "Entreprises, RH & CSE",
    shortName: "Entreprises & CSE",
    icon: Briefcase,
    tagline: "Vos équipes oublieront peut-être le discours. Pas l'expérience.",
    packs: [
      {
        id: "afterwork-vr",
        name: "Afterwork VR",
        tagline: "La pause originale qui crée l'enthousiasme.",
        price: 1_200_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Expériences fun & découverte",
        ],
      },
      {
        id: "team-building-vr",
        name: "Team Building VR",
        tagline: "La demi-journée immersive qui rapproche les équipes.",
        price: 2_400_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Expériences de cohésion & sensations",
        ],
      },
      {
        id: "seminaire-premium",
        name: "Séminaire Premium",
        tagline: "La dimension premium de vos grands événements internes.",
        price: 4_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Vidéo souvenir + support photo",
        ],
      },
    ],
  },
  {
    id: "ecoles-colleges",
    name: "Écoles & collèges",
    shortName: "Écoles & collèges",
    icon: School,
    tagline: "Les élèves peuvent regarder une leçon. Ou entrer à l'intérieur.",
    packs: [
      {
        id: "classe-decouverte",
        name: "Classe Découverte",
        tagline: "L'activité éducative courte qui éveille la curiosité.",
        price: 900_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Madagascar, monde & sciences",
        ],
      },
      {
        id: "journee-vr-educative",
        name: "Journée VR Éducative",
        tagline: "Plusieurs univers éducatifs en une expérience encadrée.",
        price: 1_900_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Histoire, géographie, océans & espace",
        ],
      },
      {
        id: "parcours-pedagogique-360",
        name: "Parcours Pédagogique 360",
        tagline: "La journée immersive adaptée au projet de l'établissement.",
        price: 4_200_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Module sur mesure + support photo",
        ],
      },
    ],
  },
  {
    id: "universite-formation",
    name: "Universités & formation",
    shortName: "Universités",
    icon: GraduationCap,
    tagline: "Les apprenants peuvent écouter une formation. Ou entrer dans l'expérience.",
    packs: [
      {
        id: "atelier-immersion",
        name: "Atelier Immersion",
        tagline: "L'atelier court pour découvrir langues et métiers.",
        price: 1_100_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Langues & découverte des métiers",
        ],
      },
      {
        id: "skills-innovation",
        name: "Skills & Innovation",
        tagline: "L'expérience centrée compétences et projection.",
        price: 2_400_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Soft skills & orientation",
        ],
      },
      {
        id: "formation-creator-360",
        name: "Formation Creator 360",
        tagline: "Les usages concrets de la création immersive.",
        price: 5_500_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Initiation captation & montage 360°",
        ],
      },
    ],
  },
  {
    id: "tourisme-agences",
    name: "Tourisme & agences de voyage",
    shortName: "Tourisme",
    icon: Plane,
    tagline: "Faites voyager vos clients avant même leur départ.",
    packs: [
      {
        id: "demo-destination",
        name: "Démo Destination",
        tagline: "La première immersion qui éveille l'envie de partir.",
        price: 1_500_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Découverte de Madagascar",
        ],
      },
      {
        id: "experience-sejour",
        name: "Expérience Séjour",
        tagline: "Vos clients se projettent dans leur séjour.",
        price: 3_200_000,
        featured: true,
        badge: "Le plus choisi",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Hôtels, circuits & plages",
        ],
      },
      {
        id: "showroom-tourisme-360",
        name: "Showroom Tourisme 360",
        tagline: "Votre destination en expérience immersive prête à présenter.",
        price: 7_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Captation 360° d'un site + montage",
        ],
      },
    ],
  },
  {
    id: "fondations-associations",
    name: "Fondations & associations",
    shortName: "Fondations & assos",
    icon: HeartHandshake,
    tagline: "Faites découvrir Madagascar et le monde autrement.",
    packs: [
      {
        id: "vr-solidaire",
        name: "VR Solidaire",
        tagline: "La première expérience qui éveille la curiosité et crée du lien.",
        price: 750_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Sensibilisation & découverte",
        ],
      },
      {
        id: "impact-educatif",
        name: "Impact Éducatif",
        tagline: "Vivre le sujet pour mieux le comprendre et le retenir.",
        price: 1_600_000,
        featured: true,
        badge: "Le plus choisi",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Contenus Madagascar, culture & monde",
        ],
      },
      {
        id: "mission-immersive",
        name: "Mission Immersive",
        tagline: "La journée qui transforme votre mission en expérience collective.",
        price: 3_800_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Contenu personnalisé + reportage photo",
        ],
      },
    ],
  },
  {
    id: "immobilier-showrooms",
    name: "Immobilier & showrooms",
    shortName: "Immobilier",
    icon: Home,
    tagline: "Un projet peut être expliqué. Ou déjà être vécu.",
    packs: [
      {
        id: "visite-vr-commerciale",
        name: "Visite VR Commerciale",
        tagline: "Le bien découvert dans une expérience immersive accessible.",
        price: 1_800_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Visite immersive de biens",
        ],
      },
      {
        id: "vente-premium-360",
        name: "Vente Premium 360",
        tagline: "La présentation qui valorise vos biens premium.",
        price: 4_500_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Vidéo 360°, photos & visite au casque",
        ],
      },
      {
        id: "projet-futur-vr",
        name: "Projet Futur en VR",
        tagline: "Le projet futur, visualisé avant sa réalisation.",
        price: 8_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Maquette ou projection 360°",
        ],
      },
    ],
  },
  {
    id: "marques-evenementiel",
    name: "Marques & évènementiel",
    shortName: "Marques & salons",
    icon: Megaphone,
    tagline: "Une marque peut être vue. Ou vécue.",
    packs: [
      {
        id: "stand-vr",
        name: "Stand VR",
        tagline: "Le point d'attraction visible autour de votre espace.",
        price: 1_900_000,
        features: [
          "3 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Expérience d'attraction",
        ],
      },
      {
        id: "brand-experience",
        name: "Brand Experience",
        tagline: "Votre marque associée à une expérience mémorable.",
        price: 4_200_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Branding & photos",
        ],
      },
      {
        id: "salon-premium-360",
        name: "Salon Premium 360",
        tagline: "L'expérience complète qui produit du contenu immersif.",
        price: 8_500_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Captation + montage vidéo 360°",
        ],
      },
    ],
  },
  {
    id: "jeux-divertissement",
    name: "Jeux & divertissement",
    shortName: "Jeux & fun",
    icon: Gamepad2,
    tagline: "Le jeu ne se regarde plus. Il se vit.",
    packs: [
      {
        id: "vr-fun",
        name: "VR Fun",
        tagline: "Découverte et plaisir immédiat.",
        price: 950_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Jeux adaptés au public, rotation organisée",
        ],
      },
      {
        id: "vr-challenge",
        name: "VR Challenge",
        tagline: "Défis, adrénaline et esprit d'équipe.",
        price: 2_200_000,
        featured: true,
        badge: "Le plus demandé",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Défis individuels ou par équipe, mini classement",
        ],
      },
      {
        id: "vr-gaming-arena",
        name: "VR Gaming Arena",
        tagline: "Une expérience VR complète.",
        price: 4_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Espace de jeu complet, tournoi et photo souvenir",
        ],
      },
    ],
  },
  {
    id: "musique-rythme",
    name: "Musique & rythme",
    shortName: "Musique",
    icon: Music,
    tagline: "La musique commence. Votre corps réagit.",
    packs: [
      {
        id: "music-discovery",
        name: "Music Discovery",
        tagline: "La première immersion musicale, courte et facile à organiser.",
        price: 700_000,
        features: [
          "2 h d'animation",
          "2 casques Meta Quest 3",
          "1 animateur XR",
          "Défis de rythme et comparaison des scores",
        ],
      },
      {
        id: "music-challenge",
        name: "Music Challenge",
        tagline: "Plus de joueurs, plus de défis, plus d'énergie.",
        price: 1_900_000,
        featured: true,
        badge: "Le plus choisi",
        features: [
          "Demi-journée d'animation",
          "6 casques Meta Quest 3",
          "2 animateurs XR",
          "Niveaux progressifs, duels et mini-tournoi",
        ],
      },
      {
        id: "music-live-arena",
        name: "Music Live Arena",
        tagline: "L'expérience musicale VR complète.",
        price: 4_500_000,
        features: [
          "Journée complète d'animation",
          "10 casques Meta Quest 3",
          "2 animateurs XR",
          "Plusieurs univers musicaux, tournois et classement final",
        ],
      },
    ],
  },
];

export function getOffer(id: OfferId): Offer {
  return getGroup(OFFERS, id);
}

/** Prix d'appel d'une offre (tuiles du sélecteur) : le pack le moins cher. */
export function offerPriceFrom(offer: Offer): number {
  return groupPriceFrom(offer);
}

/** Libellés du champ « secteur » du formulaire, dérivés et jamais dupliqués. */
export const OFFER_LABELS = groupLabels(OFFERS);

/** Ids de packs (unicité globale, invariant testé) : enum Zod du champ « pack ». */
export const ALL_PACK_IDS: readonly string[] = allPackIds(OFFERS);
