import type { OfferGroup } from "./types";

/**
 * Audits purs des catalogues d'offres, consommés par les tests gardiens de
 * chaque pôle (`products/<pôle>/config/offers.test.ts`). Chaque fonction rend
 * la LISTE des anomalies : un catalogue sain rend un tableau vide, et le
 * message d'échec nomme directement le coupable.
 *
 * VR impose en plus ses propres invariants (prix strictement croissants, pack
 * vedette en position centrale) : ils vivent dans son test, car ils décrivent
 * une convention éditoriale « bon / mieux / premium » que les deux autres
 * pôles ne partagent pas.
 */

/** Ids de packs présents plus d'une fois : ils deviendraient ambigus en base. */
export function duplicatePackIds(groups: readonly OfferGroup[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const group of groups) {
    for (const pack of group.packs) {
      if (seen.has(pack.id)) duplicates.add(pack.id);
      seen.add(pack.id);
    }
  }
  return [...duplicates];
}

/** Groupes qui n'ont pas exactement un pack vedette. */
export function groupsWithoutSingleFeatured(groups: readonly OfferGroup[]): readonly string[] {
  return groups
    .filter((group) => group.packs.filter((pack) => pack.featured === true).length !== 1)
    .map((group) => group.id);
}

/**
 * Groupes dont les prix décroissent d'un pack au suivant. L'égalité est
 * tolérée : deux solutions LiDAR techniques partagent le même plancher de
 * 1 500 000 Ar (minimum de mission), ce que la brochure assume.
 */
export function groupsWithDecreasingPrices(groups: readonly OfferGroup[]): readonly string[] {
  return groups
    .filter((group) => group.packs.some((pack, index) => index > 0 && pack.price < group.packs[index - 1].price))
    .map((group) => group.id);
}

/** Groupes dont l'id n'a pas son token d'accent ET son mappeur dans globals.css. */
export function missingAccentTokens(
  css: string,
  groups: readonly OfferGroup[],
): readonly string[] {
  return groups
    .filter(
      (group) =>
        !css.includes(`--color-offer-${group.id}:`) ||
        !css.includes(`[data-offer-accent="${group.id}"]`),
    )
    .map((group) => group.id);
}
