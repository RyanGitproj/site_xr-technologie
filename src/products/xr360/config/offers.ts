import {
  BedDouble,
  Building2,
  GraduationCap,
  Home,
  Landmark,
  Store,
  TreePalm,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { getGroup, groupLabels } from "@/components/offers/catalog";
import type { ImageSlot } from "@/lib/images";
import type { OfferGroup, OfferPack } from "@/components/offers/types";

/**
 * Le catalogue XR 360 : 3 offres chiffrées, présentées à travers 8 cibles.
 * SOURCE DE VÉRITÉ : docs/Nouvelle_brochure/XR 360 - BROCHURE.pdf (prix,
 * contenus, cibles « à qui s'adresse XR 360 ? », recommandations « quel
 * format choisir ? »).
 *
 * Contrairement à VR (10 offres × 3 packs distincts), les 8 tuiles vendent
 * les 3 MÊMES offres : chaque cible ne personnalise que l'accroche et
 * l'offre recommandée (featured). Les 3 offres de base sont donc définies
 * une seule fois et clonées par cible, l'invariant étant vérifié par le
 * test gardien : mêmes ids, mêmes prix, mêmes features sur les 8 tuiles.
 *
 * Les ids ALIMENTENT la base : cibles = valeurs `type_lieu` du brief
 * (mêmes ids que TYPE_LIEU_VALUES), offres = colonne `offre`. NE JAMAIS
 * les renommer après mise en prod. Prix « à partir de », en ariary.
 */

export const XR360_PACK_IDS = ["essentiel", "visite-pro", "immersion-premium"] as const;

export type Xr360PackId = (typeof XR360_PACK_IDS)[number];

/** Cibles de la brochure, dans son ordre : ce sont les ids de `type_lieu`. */
export const XR360_OFFER_IDS = [
  "hotel-hebergement",
  "immobilier",
  "restaurant",
  "commerce-showroom",
  "site-touristique",
  "ecole-formation",
  "entreprise",
  "site-culturel-patrimonial",
] as const;

export type Xr360OfferId = (typeof XR360_OFFER_IDS)[number];

export type Xr360Offer = OfferGroup<Xr360OfferId>;

export type { OfferPack };

/** Compositions devices (lot J Codex) : un visuel stable par offre. */
const PACK_VISUALS: Record<Xr360PackId, ImageSlot> = {
  essentiel: {
    src: "/images/funnel-v2/xr360-offre-visite.webp",
    alt: "Ordinateur portable, smartphone et chevalet QR code",
    width: 1400,
    height: 933,
  },
  "visite-pro": {
    src: "/images/funnel-v2/xr360-offre-experience.webp",
    alt: "Caméra 360 sur perche, ordinateur portable et smartphone",
    width: 1400,
    height: 933,
  },
  "immersion-premium": {
    src: "/images/funnel-v2/xr360-offre-signature.webp",
    alt: "Drone FPV, caméra 360, casque VR et ordinateur portable",
    width: 1400,
    height: 933,
  },
};

/** Les 3 offres de la brochure, définies UNE fois (prix et contenus). */
const BASE_PACKS: readonly [OfferPack, OfferPack, OfferPack] = [
  {
    id: "essentiel",
    name: "XR 360 Essentiel",
    tagline: "Votre première visite 360°, claire et accessible à distance.",
    price: 700_000,
    features: [
      "Captation photo 360° d'un espace simple",
      "3 à 5 points de vue environ",
      "Lien de consultation partageable",
      "Présentation sur téléphone, ordinateur ou tablette",
    ],
    visual: PACK_VISUALS.essentiel,
  },
  {
    id: "visite-pro",
    name: "XR 360 Visite Pro",
    tagline: "Une vraie visite interactive qui relie vos espaces.",
    price: 1_500_000,
    features: [
      "Captation photo 360° de plusieurs zones (6 à 10)",
      "Navigation entre les espaces",
      "Lien partageable : WhatsApp, réseaux sociaux, site",
      "Présentation fluide sur tous les appareils",
    ],
    visual: PACK_VISUALS["visite-pro"],
  },
  {
    id: "immersion-premium",
    name: "XR 360 Immersion Premium",
    tagline: "Votre lieu valorisé dans ses moindres détails.",
    price: 3_200_000,
    features: [
      "Captation complète du lieu (12 à 20 zones)",
      "Parcours interactif structuré",
      "Contenus prêts pour la communication digitale",
      "Intégration possible sur site ou funnel",
    ],
    visual: PACK_VISUALS["immersion-premium"],
  },
];

type LieuDefinition = {
  id: Xr360OfferId;
  name: string;
  shortName: string;
  icon: LucideIcon;
  /** Accroche de la cible : reprend le bénéfice brochure pour ce lieu. */
  tagline: string;
  /** Offre recommandée pour la cible (« quel format choisir ? » brochure). */
  recommended: Xr360PackId;
};

/** Cibles brochure + recommandation par cible (sections « idéal pour »). */
const LIEUX: readonly LieuDefinition[] = [
  {
    id: "hotel-hebergement",
    name: "Hôtels & hébergements",
    shortName: "Hôtels",
    icon: BedDouble,
    tagline: "Vos futurs clients explorent chambres et espaces avant de réserver.",
    recommended: "visite-pro",
  },
  {
    id: "immobilier",
    name: "Immobilier",
    shortName: "Immobilier",
    icon: Home,
    tagline: "Un bien se comprend mieux quand on peut déjà le visiter.",
    recommended: "essentiel",
  },
  {
    id: "restaurant",
    name: "Restaurants",
    shortName: "Restaurants",
    icon: UtensilsCrossed,
    tagline: "L'ambiance réelle de votre salle, visible avant la réservation.",
    recommended: "visite-pro",
  },
  {
    id: "commerce-showroom",
    name: "Commerces & showrooms",
    shortName: "Commerces",
    icon: Store,
    tagline: "Votre espace et vos produits, explorés comme sur place.",
    recommended: "visite-pro",
  },
  {
    id: "site-touristique",
    name: "Sites touristiques",
    shortName: "Tourisme",
    icon: TreePalm,
    tagline: "Donnez envie de venir en faisant déjà vivre le lieu à distance.",
    recommended: "immersion-premium",
  },
  {
    id: "ecole-formation",
    name: "Écoles & formations",
    shortName: "Écoles",
    icon: GraduationCap,
    tagline: "Campus et salles visitables par les familles et les étudiants.",
    recommended: "immersion-premium",
  },
  {
    id: "entreprise",
    name: "Entreprises",
    shortName: "Entreprises",
    icon: Building2,
    tagline: "Présentez vos locaux à vos clients, candidats et partenaires.",
    recommended: "immersion-premium",
  },
  {
    id: "site-culturel-patrimonial",
    name: "Lieux culturels & patrimoniaux",
    shortName: "Culture",
    icon: Landmark,
    tagline: "Un patrimoine qui se découvre au-delà de ses horaires d'ouverture.",
    recommended: "immersion-premium",
  },
];

const RECOMMENDED_BADGE = "Recommandé pour vous";

/** Clone les 3 offres de base pour une cible, en ne posant que la vedette. */
function buildLieuGroup(lieu: LieuDefinition): Xr360Offer {
  return {
    id: lieu.id,
    name: lieu.name,
    shortName: lieu.shortName,
    icon: lieu.icon,
    tagline: lieu.tagline,
    packs: BASE_PACKS.map((pack) =>
      pack.id === lieu.recommended
        ? { ...pack, featured: true, badge: RECOMMENDED_BADGE }
        : pack,
    ) as [OfferPack, OfferPack, OfferPack],
  };
}

export const XR360_OFFERS: readonly Xr360Offer[] = LIEUX.map(buildLieuGroup);

export function getXr360Offer(id: Xr360OfferId): Xr360Offer {
  return getGroup(XR360_OFFERS, id);
}

/** Libellés dérivés des cibles (tuiles ET champ « type de lieu » du brief). */
export const XR360_OFFER_LABELS = groupLabels(XR360_OFFERS);

/** Les 3 offres de base (enum Zod du champ « offre », options du formulaire). */
export const XR360_BASE_PACKS = BASE_PACKS;
