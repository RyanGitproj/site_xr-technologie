import type { LucideIcon } from "lucide-react";
import type { ImageSlot } from "@/lib/images";

/**
 * Contrat commun des catalogues d'offres des trois pôles. Chaque pôle décrit
 * ses groupes dans son propre `config/offers.ts` (source : les brochures
 * officielles de docs/) et les passe à OfferExplorer. Les ids (groupes ET
 * packs) alimentent les enums Zod et des colonnes de base : ne JAMAIS les
 * renommer après mise en prod.
 */

export type OfferPack = {
  id: string;
  name: string;
  tagline: string;
  /** Prix « à partir de », en ariary. */
  price: number;
  features: readonly string[];
  /**
   * Suppléments chiffrés de la brochure, affichés sous les features (LiDAR
   * technique). Les fourchettes et unités (Ar/m², Ar/mois) vivent dans ces
   * libellés : le prix reste un plancher unique.
   */
  options?: readonly string[];
  featured?: boolean;
  badge?: string;
  /** Visuel de card, quand le pôle en a un (XR 360). */
  visual?: ImageSlot;
};

export type OfferGroup<Id extends string = string> = {
  id: Id;
  /** Nom complet : libellé du formulaire et lecture des leads. */
  name: string;
  /** Libellé compact de la tuile du sélecteur. */
  shortName: string;
  icon: LucideIcon;
  /** Accroche brochure, affichée au-dessus des packs du groupe actif. */
  tagline: string;
  packs: readonly [OfferPack, OfferPack, OfferPack];
};

/** Textes du sélecteur, propres à chaque pôle. */
export type OfferCopy = {
  selectorLabel: string;
  hint: string;
  panelIntroPrefix: string;
  pricePrefix: string;
  cta: string;
};
