/** Rampes de chorégraphie des scènes 3D scroll-driven (extrait de la scène
    casque /vr, partagé par toutes les scènes : casque, pano 360, scan LiDAR). */

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Interpolation lissée (smoothstep) de `a`→`b` sur la fenêtre [p0, p1]. */
export function ramp(p: number, p0: number, p1: number, a: number, b: number) {
  const t = clamp01((p - p0) / (p1 - p0));
  const s = t * t * (3 - 2 * t);
  return a + (b - a) * s;
}
