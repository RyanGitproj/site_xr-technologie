/** Pont tokens-only → WebGL : lit une custom property CSS résolue sur un
 * élément (couleur du thème actif) pour la passer aux matériaux/uniforms.
 * À appeler UNE fois au montage de la scène, jamais par frame. */
export function readCssColor(el: Element, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value === "" ? fallback : value;
}
