/**
 * Moteur pur du rail de cartes « deck » (DeckRail) : profondeur d'une carte
 * dans le viewport du rail, côté de débordement, découpage en pages.
 *
 * Tout vit ici pour être testé sans DOM, et surtout pour que le handler de
 * scroll ne fasse QUE du calcul : les lectures de layout par frame
 * (getBoundingClientRect, offsetWidth) pendant un défilement lissé forcent un
 * reflow par événement et effondrent le FPS. La géométrie est mesurée une
 * fois par le composant, ces fonctions la consomment.
 */

/** Côté par lequel une carte déborde du viewport du rail. 0 = entière. */
export type RailSide = -1 | 0 | 1;

export interface RailSlideState {
  /** Part visible de la carte, 0 (hors champ) → 1 (entière). */
  depth: number;
  side: RailSide;
}

const FULLY_VISIBLE_EPSILON = 0.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Profondeur et côté d'une carte, depuis sa position dans le track et la
 * fenêtre visible. `start` est l'offset de la carte relatif à la première,
 * `scrollLeft` la position du rail, `viewWidth` sa largeur visible.
 *
 * Une carte plus large que la fenêtre déborde des deux côtés : le côté retenu
 * est celui du plus grand débordement (l'autre est masqué par le voisin).
 */
export function railSlideState(
  start: number,
  width: number,
  scrollLeft: number,
  viewWidth: number,
): RailSlideState {
  if (width <= 0) return { depth: 1, side: 0 };

  const viewEnd = scrollLeft + viewWidth;
  const visible = Math.min(start + width, viewEnd) - Math.max(start, scrollLeft);
  const depth = clamp(visible / width, 0, 1);

  const overflowLeft = Math.max(0, scrollLeft - start);
  const overflowRight = Math.max(0, start + width - viewEnd);
  if (overflowLeft <= FULLY_VISIBLE_EPSILON && overflowRight <= FULLY_VISIBLE_EPSILON) {
    return { depth, side: 0 };
  }
  return { depth, side: overflowRight > overflowLeft ? 1 : -1 };
}

/**
 * Nombre de cartes pleines par vue, déduit de la géométrie réelle plutôt que
 * d'un breakpoint dupliqué en JS : la largeur des cartes est décidée en CSS,
 * elle reste la seule source de vérité.
 */
export function railPerView(viewWidth: number, slideWidth: number, gap: number): number {
  if (slideWidth <= 0) return 1;
  return Math.max(1, Math.round((viewWidth + gap) / (slideWidth + gap)));
}

/**
 * Offsets de défilement des pages. Le dernier est borné par `maxScroll` :
 * sans ce clamp, la dernière page vise une position inatteignable et le rail
 * ne se considère jamais arrivé au bout (flèche « suivant » jamais éteinte,
 * mauvais point actif).
 */
export function railPageOffsets(
  offsets: readonly number[],
  perView: number,
  maxScroll: number,
): number[] {
  if (offsets.length === 0) return [0];
  const step = Math.max(1, perView);
  const pages = Math.max(1, Math.ceil(offsets.length / step));
  const limit = Math.max(0, maxScroll);
  return Array.from({ length: pages }, (_, page) =>
    clamp(offsets[Math.min(offsets.length - 1, page * step)], 0, limit),
  );
}

/** Page dont l'offset est le plus proche de la position courante. */
export function railNearestPage(pageOffsets: readonly number[], scrollLeft: number): number {
  let nearest = 0;
  let best = Infinity;
  for (let page = 0; page < pageOffsets.length; page++) {
    const distance = Math.abs(pageOffsets[page] - scrollLeft);
    if (distance < best) {
      best = distance;
      nearest = page;
    }
  }
  return nearest;
}
