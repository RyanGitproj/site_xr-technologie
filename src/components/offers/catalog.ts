import type { OfferGroup, OfferPack } from "./types";

/**
 * Helpers purs partagés par les trois catalogues d'offres. Tout ce qui peut
 * être dérivé du catalogue l'est ici : aucun pôle ne redéclare un libellé, un
 * prix d'appel ou une liste d'ids déjà présents dans ses données.
 */

export function getGroup<Id extends string>(
  groups: readonly OfferGroup<Id>[],
  id: Id,
): OfferGroup<Id> {
  const group = groups.find((candidate) => candidate.id === id);
  if (group === undefined) throw new Error(`Groupe d'offre inconnu : ${id}`);
  return group;
}

/** Prix d'appel d'un groupe (tuiles du sélecteur) : le pack le moins cher. */
export function groupPriceFrom(group: OfferGroup): number {
  return Math.min(...group.packs.map((pack) => pack.price));
}

/** Ids de packs du catalogue : enum Zod du champ « pack » du formulaire. */
export function allPackIds(groups: readonly OfferGroup[]): readonly string[] {
  return groups.flatMap((group) => group.packs.map((pack) => pack.id));
}

/** Libellés du champ « groupe » du formulaire, dérivés et jamais dupliqués. */
export function groupLabels<Id extends string>(
  groups: readonly OfferGroup<Id>[],
): Record<Id, string> {
  return Object.fromEntries(groups.map((group) => [group.id, group.name])) as Record<Id, string>;
}

export function findPack<Id extends string>(
  groups: readonly OfferGroup<Id>[],
  groupId: Id,
  packId: string,
): OfferPack | undefined {
  return getGroup(groups, groupId).packs.find((pack) => pack.id === packId);
}

/** Garde de cohérence groupe/pack, partagée par le superRefine des schémas. */
export function packBelongsToGroup<Id extends string>(
  groups: readonly OfferGroup<Id>[],
  groupId: Id,
  packId: string,
): boolean {
  return findPack(groups, groupId, packId) !== undefined;
}

/**
 * Colonnes du sélecteur au-delà du mobile (qui reste à 2). Le nombre de
 * tuiles varie d'un pôle à l'autre : on choisit le diviseur qui remplit des
 * rangées pleines, pour ne jamais laisser une tuile orpheline en fin de
 * grille. 2 → 2, 8 → 4, 10 → 5.
 */
export function selectorColumns(tileCount: number): number {
  if (tileCount <= 3) return tileCount;
  for (const columns of [5, 4, 3]) {
    if (tileCount % columns === 0) return columns;
  }
  return 4;
}
