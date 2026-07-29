/**
 * Géométrie pure de la fenêtre panoramique (fx Pano360) : dimensions du
 * cylindre partiel, limites de regard et positions des hotspots. Les photos
 * larges (~2:1, non équirectangulaires) sont projetées sur un ARC de
 * cylindre ; une vraie équirectangulaire (lot G) passera en sphère via
 * `projection: "sphere"`, sans changer ces contrats.
 */

export type PanoProjection = "cylinder" | "sphere";

/** Rayon de la surface : la caméra est à l'origine, dedans. */
export const PANO_RADIUS = 6;
/** FOV vertical de la caméra intérieure. */
export const PANO_FOV_DEG = 52;
/** Arc par défaut (deg) : assez d'amplitude sans étirer la photo. */
export const PANO_ARC_DEG_DEFAULT = 160;
/** Débattement vertical de la sphère (rad) : borné avant les pôles. */
export const SPHERE_PITCH_LIMIT = (35 * Math.PI) / 180;
/** Les hotspots vivent légèrement en avant de la surface. */
export const HOTSPOT_INSET = 0.05;

const DEG = Math.PI / 180;

export type CylinderDims = {
  height: number;
  thetaStart: number;
  thetaLength: number;
};

/** Hauteur anti-distorsion : le ratio arc/hauteur = ratio de l'image
    (aucun étirement vertical), arc centré face caméra (-Z). */
export function cylinderDims(arcDeg: number, imageRatio: number, radius = PANO_RADIUS): CylinderDims {
  const thetaLength = arcDeg * DEG;
  return {
    thetaLength,
    thetaStart: Math.PI - thetaLength / 2,
    height: radius * thetaLength * imageRatio,
  };
}

/** FOV horizontal (rad) dérivé du FOV vertical (deg) et de l'aspect. */
export function horizontalFov(fovDeg: number, aspect: number): number {
  return 2 * Math.atan(Math.tan((fovDeg * DEG) / 2) * aspect);
}

/** Yaw max (rad) : les bords latéraux de l'arc ne se découvrent jamais. */
export function yawLimit(arcDeg: number, fovDeg: number, aspect: number): number {
  return Math.max(0, (arcDeg * DEG) / 2 - horizontalFov(fovDeg, aspect) / 2);
}

/** Pitch max (rad) : les bords haut/bas de l'arc ne se découvrent jamais. */
export function pitchLimit(height: number, radius: number, fovDeg: number): number {
  return Math.max(0, Math.atan(height / (2 * radius)) - (fovDeg * DEG) / 2);
}

/**
 * Position monde d'un hotspot défini en coordonnées IMAGE (u,v ∈ 0..1,
 * origine en haut-gauche), sur la surface active. Convention alignée sur le
 * rendu (géométrie en scale(-1,1,1)) : u=0.5 face caméra, u=1 à droite.
 */
export function hotspotPosition(
  u: number,
  v: number,
  projection: PanoProjection,
  arcDeg: number,
  imageRatio: number,
  radius = PANO_RADIUS,
): [number, number, number] {
  const r = radius - HOTSPOT_INSET;
  if (projection === "sphere") {
    const a = Math.PI + (u - 0.5) * 2 * Math.PI;
    const phi = v * Math.PI;
    const ring = r * Math.sin(phi);
    return [-ring * Math.sin(a), r * Math.cos(phi), ring * Math.cos(a)];
  }
  const { thetaStart, thetaLength, height } = cylinderDims(arcDeg, imageRatio, radius);
  const a = thetaStart + u * thetaLength;
  return [-r * Math.sin(a), (0.5 - v) * height, r * Math.cos(a)];
}
