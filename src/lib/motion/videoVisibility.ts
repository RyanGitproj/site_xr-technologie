/** Règle de lecture d'une vidéo pilotée par le scroll : « assez visible pour
    mériter de tourner ». Pure et testée, car le cas piégeux (vidéo plus haute
    que le viewport, où le ratio d'IntersectionObserver ne peut JAMAIS
    atteindre le seuil) se répète à chaque nouveau média plein écran. */

export const VIDEO_VISIBLE_RATIO = 0.5;

type VisibilityRects = {
  /** Part réellement dans le viewport (entry.intersectionRect). */
  intersectionHeight: number;
  /** Hauteur totale de l'élément (entry.boundingClientRect). */
  elementHeight: number;
  /** Hauteur du viewport (entry.rootBounds), null si indisponible. */
  rootHeight: number | null;
};

/**
 * Vrai quand la part visible atteint `ratio` de la vidéo, ou de la hauteur du
 * viewport si la vidéo est plus grande que lui (sinon une vidéo pleine page
 * ne serait jamais considérée visible et ne jouerait jamais).
 */
export function isVideoVisibleEnough(
  { intersectionHeight, elementHeight, rootHeight }: VisibilityRects,
  ratio: number = VIDEO_VISIBLE_RATIO,
): boolean {
  const reference =
    rootHeight === null ? elementHeight : Math.min(elementHeight, rootHeight);
  if (reference <= 0) return false;
  return intersectionHeight / reference >= ratio;
}
